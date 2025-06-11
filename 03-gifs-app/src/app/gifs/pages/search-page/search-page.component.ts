import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-app',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchAppComponent {
  gifService = inject(GifService);
  //traer los gifs
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gifService.searchGifs(query).subscribe((resp) => {
      this.gifs.set(resp);
    });
  }
}
