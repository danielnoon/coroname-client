import { Component, OnInit } from "@angular/core";
import { Anime } from "src/models/anime";
import { ApiService, HttpMethod } from "../api.service";
import { User } from "../user";
import { IonRefresher, PopoverController } from "@ionic/angular";
import { UserPopoverComponent } from "../user-popover/user-popover.component";
import { VotesPopoverComponent } from "../votes-popover/votes-popover.component";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  anime: Anime[] = [];
  query: string;
  votesAvailable = 0;
  username = "";
  hasLoaded = false;
  searching = false;
  userIcon = "";

  constructor(private api: ApiService, private pop: PopoverController) {}

  ngOnInit() {
    if (User.me) {
      this.votesAvailable = User.me.votesAvailable;
      this.username = User.me.username;
      this.userIcon = User.getGravatar(User.me);
    }

    User.listen(() => {
      this.votesAvailable = User.me.votesAvailable;
      this.username = User.me.username;
      this.userIcon = User.getGravatar(User.me);
    });

    this.getCurrentAnime();
  }

  async search() {
    this.hasLoaded = false;

    if (!this.query) {
      await this.getCurrentAnime();
    } else {
      const anime = await this.api.request<Anime[]>({
        route: "anime/search",
        method: HttpMethod.GET,
        query: "q=" + this.query,
      });

      this.searching = true;

      this.anime = anime.data;

      this.hasLoaded = true;
    }
  }

  async getCurrentAnime() {
    const anime = await this.api.request<Anime[]>({
      route: "anime/current",
      method: HttpMethod.GET,
    });

    this.searching = false;

    this.anime = anime.data;

    this.hasLoaded = true;
  }

  updateListing() {
    if (!this.searching) {
      this.getCurrentAnime();
    } else {
      this.search();
    }
  }

  async openUserPopover(e: MouseEvent) {
    const popover = await this.pop.create({
      component: UserPopoverComponent,
      event: e,
      translucent: true,
    });

    await popover.present();
  }

  async openVotesPopover(e: MouseEvent) {
    const popover = await this.pop.create({
      component: VotesPopoverComponent,
      event: e,
      translucent: true,
    });

    await popover.present();
  }

  async reset() {
    this.hasLoaded = false;
    this.query = "";
    await this.getCurrentAnime();
    await User.init(this.api);
  }

  trackByAnime(index: number, item: Anime) {
    return item.kitsuId;
  }

  async doRefresh(ev: IonRefresher) {
    if (this.searching) {
      await this.search();
    } else {
      await this.reset();
    }

    ev.complete();
  }
}
