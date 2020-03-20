import { Component, OnInit } from '@angular/core';
import { Anime } from 'src/models/anime';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  anime: Anime[] = [];
  query: string;

  constructor(private api: ApiService) {}

  ngOnInit() {
    // this.getTopAnime();
  }

  async search() {
    const anime = await this.api.request<Anime[]>({
      route: 'anime/search',
      method: 'get',
      query: 'q=' + this.query
    });

    this.anime = anime.data;
  }
}
