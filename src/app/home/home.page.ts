import { Component, OnInit } from '@angular/core';
import { Anime } from 'src/models/anime';
import { ApiService } from '../api-service.service';
import { User } from '../user';
import { PopoverController } from '@ionic/angular';
import { UserPopoverComponent } from '../user-popover/user-popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  anime: Anime[] = [];
  query: string;
  votesAvailable = User.me.votesAvailable;
  username = User.me.username;

  constructor(private api: ApiService, private pop: PopoverController) {}

  ngOnInit() {
    User.listen(() => {
      this.votesAvailable = User.me.votesAvailable;
      this.username = User.me.username;
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

  async openUserPopover(e: MouseEvent) {
    const popover = await this.pop.create({
      component: UserPopoverComponent,
      event: e,
      translucent: true
    });

    await popover.present();
  }

  reset() {
    this.query = "";
    this.getCurrentAnime();
  }
}
