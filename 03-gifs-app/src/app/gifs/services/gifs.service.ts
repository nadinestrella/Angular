import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

import { environment } from '@environments/environment.development';
import { Gif } from '../interfaces/gif.interface';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { GifMapper } from '../mapper/gif.mapper';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {
  // const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}'; //Record<string, gifs[]>
  // const gifs = JSON.parse(gifsFromLocalStorage);
  // console.log(gifs);
  // return gifs;
  try {
    const gifsFromLocalStorage = localStorage.getItem(GIF_KEY);
    if (!gifsFromLocalStorage || gifsFromLocalStorage === 'undefined') {
      return {};
    }
    return JSON.parse(gifsFromLocalStorage);
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    return {};
  }
};

@Injectable({ providedIn: 'root' })
export class GifService {
  //aqui se injecta y en el app.conf lo proveemos
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());

  //senal computada
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    //sirve para inicializar el servicio haciendo una primera carga de gifs
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  // LoadGifs

  loadTrendingGifs() {
    // Peticion post,put,patch,get

    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
        },
      })
      //para que se dispare la peticion http necesitas subcribirte
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
        // console.log({ gifs });
      });
  }

  // Search

  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query,
        },
      })

      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
        //efecto secundario para el historial
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }));
        })
      );
  }

  // History

  getHistoryGifs(query: string) {
    return this.searchHistory()[query] ?? [];
  }
}
