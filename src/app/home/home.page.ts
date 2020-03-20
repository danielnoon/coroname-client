import { Component, OnInit } from '@angular/core';
import { Anime } from 'src/models/anime';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private api: ApiService) {}

  anime: Anime[] = [];

  ngOnInit() {
    this.getTopAnime();
  }

  async getTopAnime() {
    const anime = await this.api.request<Anime[]>({
      route: 'anime/search',
      method: 'get',
      query: 'q=Nichijou'
    });

    this.anime = anime.data;
  }
}
