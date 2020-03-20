import { Component, OnInit, Input } from '@angular/core';
import { Anime } from 'src/models/anime';
import { ApiService } from '../api-service.service';
import { User } from '../user';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
})
export class ListingComponent implements OnInit {

  @Input() anime: Anime;
  votedFor = false;
  admin = false;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.votedFor = User.votedFor.includes(this.anime.kitsuId);
    this.admin = User.admin;

    User.listen(() => {
      this.admin = User.admin;
    });
  }

  async vote() {
    const result = await this.api.request({
      route: 'anime/vote',
      method: 'post',
      body: JSON.stringify({ id: this.anime.kitsuId })
    });

    if (result.code === 0) {
      this.anime.votes++;
      this.votedFor = true;
      User.votesAvailable--;
    }
  }

  async setAsCS() {
    const result = await this.api.request({
      route: 'anime/continuing-series',
      method: 'post',
      body: JSON.stringify({ id: this.anime.kitsuId })
    });

    if (result.code === 0) {
      location.reload();
    }
  }
}
