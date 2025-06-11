import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';

@Component({
  selector: 'app-search-app',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchAppComponent {
  gifService = inject(GifService);

  onSearch(query: string) {
    this.gifService.searchGifs(query);
  }
}
