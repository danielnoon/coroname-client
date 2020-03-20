import { Component, OnInit } from '@angular/core';
import { Anime } from 'src/models/anime';
import { ApiService } from '../api-service.service';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  anime: Anime[] = [];
  query: string;
  votesAvailable = User.votesAvailable;
  username = User.username;

  constructor(private api: ApiService) {}

  ngOnInit() {
    User.listen(() => {
      this.votesAvailable = User.votesAvailable;
      this.username = User.username;
    });

    this.getCurrentAnime();
  }

  async search() {
    if (!this.query) {
      this.getCurrentAnime();
    } else {
      const anime = await this.api.request<Anime[]>({
        route: 'anime/search',
        method: 'get',
        query: 'q=' + this.query
      });

      this.anime = anime.data;
    }
  }

  async getCurrentAnime() {
    const anime = await this.api.request<Anime[]>({
      route: 'anime/current',
      method: 'get'
    });

    this.anime = anime.data;
  }
}
