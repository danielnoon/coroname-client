import { Component, OnInit, Input } from '@angular/core';
import { Anime } from 'src/models/anime';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
})
export class ListingComponent implements OnInit {

  @Input() anime: Anime;
  votedFor = false;

  constructor(private api: ApiService) { }

  ngOnInit() {}

  async vote() {
    const result = await this.api.request({
      route: 'anime/vote',
      method: 'post',
      body: JSON.stringify({ id: this.anime.kitsuId })
    });

    if (result.code === 0) {
      this.anime.votes++;
    }
  }

}
