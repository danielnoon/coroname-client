import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Anime } from "src/models/anime";
import { ApiService, HttpMethod } from "../api.service";
import { User } from "../user";
import { PopoverController } from "@ionic/angular";
import { VoterDetailsComponent } from "../voter-details/voter-details.component";
import { EpisodeSelectPopoverComponent } from "../episode-select-popover/episode-select-popover.component";

@Component({
  selector: "app-listing",
  templateUrl: "./listing.component.html",
  styleUrls: ["./listing.component.scss"],
})
export class ListingComponent implements OnInit {
  @Input() anime: Anime;
  @Output() update = new EventEmitter();

  votedFor = false;
  admin = false;
  permissions: string[] = [];
  voters: User[] = [];

  constructor(private api: ApiService, private popover: PopoverController) {}

  ngOnInit() {
    if (User.me) {
      this.votedFor = User.me.votedFor.includes(this.anime.kitsuId);
      this.admin = User.me.admin;
      this.permissions = User.me.permissions;
    }

    User.listen(() => {
      this.votedFor = User.me.votedFor.includes(this.anime.kitsuId);
      this.admin = User.me.admin;
      this.permissions = User.me.permissions;
      this.getVoters();

      if (
        !User.me.votedFor.includes(this.anime.kitsuId) &&
        this.voters.some((user) => user.username === User.me.username)
      ) {
        this.anime.votes -= 1;
      }
    });

    this.getVoters();
  }

  async vote() {
    const result = await this.api.request({
      route: `anime/votes/${this.anime.kitsuId}`,
      method: HttpMethod.POST,
    });

    if (result.code === 0) {
      this.anime.votes++;
      this.votedFor = true;
      User.me.votesAvailable--;
      User.me.votedFor.push(this.anime.kitsuId);
      User.update();
    }
  }

  async rescind() {
    const result = await this.api.request({
      route: `anime/votes/${this.anime.kitsuId}`,
      method: HttpMethod.DELETE,
    });

    if (result.code === 0) {
      this.anime.votes--;
      this.votedFor = false;
      User.me.votesAvailable++;
      User.me.votedFor = User.me.votedFor.filter(
        (id) => id != this.anime.kitsuId
      );
      User.update();
    }
  }

  async setAsCS() {
    const result = await this.api.request({
      route: "anime/continuing-series",
      method: HttpMethod.PUT,
      body: JSON.stringify({ id: this.anime.kitsuId }),
    });

    if (result.code === 0) {
      this.update.emit();
    }
  }

  async remove() {
    const result = await this.api.request({
      route: "anime/current/" + this.anime.kitsuId,
      method: HttpMethod.DELETE,
    });

    if (result.code === 0) {
      this.update.emit();
    }
  }

  async getVoters() {
    const result = await this.api.request<User[]>({
      route: `anime/votes/${this.anime.kitsuId}`,
      method: HttpMethod.GET,
    });

    if (result.code === 0) {
      this.voters = result.data;
    }
  }

  getGravatar(user: User) {
    return User.getGravatar(user);
  }

  async openVoterDetails(ev: MouseEvent) {
    const popover = await this.popover.create({
      component: VoterDetailsComponent,
      componentProps: {
        users: this.voters,
      },
      event: ev,
      showBackdrop: false,
    });

    popover.present();
  }

  async incrementEpisode(ev: MouseEvent) {
    ev.stopPropagation();

    if (this.anime.episode === this.anime.episodes) return;

    this.setEpisode(this.anime.episode + 1);
  }

  async openEpisodeSelect(ev: MouseEvent) {
    if (!(this.permissions.includes("change episode") || this.admin)) return;

    const pop = await this.popover.create({
      component: EpisodeSelectPopoverComponent,
      event: ev,
      componentProps: {
        episode: this.anime.episode,
        maxEpisode: this.anime.episodes,
        update: (episode: number) => {
          this.anime.episode = episode;
        },
      },
    });

    await pop.present();

    await pop.onDidDismiss();

    this.setEpisode(this.anime.episode);
  }

  async setEpisode(ep: number) {
    const result = await this.api.request({
      route: `anime/shows/${this.anime.kitsuId}`,
      method: HttpMethod.PATCH,
      body: JSON.stringify({
        episode: ep,
      }),
    });

    if (result.code === 0) {
      this.anime.episode = ep;
    }
  }
}
