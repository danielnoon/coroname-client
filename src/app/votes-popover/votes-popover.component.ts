import { Component, OnInit } from "@angular/core";
import { Anime } from "src/models/anime";
import { ApiService, HttpMethod } from "../api.service";
import { User } from "../user";

@Component({
  selector: "app-votes-popover",
  templateUrl: "./votes-popover.component.html",
  styleUrls: ["./votes-popover.component.scss"],
})
export class VotesPopoverComponent implements OnInit {
  loading = true;
  votes: Anime[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.getShows();
  }

  async getShows() {
    const { code, data } = await this.api.request<Anime[]>({
      route: `users/${User.me.username}/votes`,
      method: HttpMethod.GET,
    });

    if (code === 0) {
      this.votes = data;
    }
  }

  async rescind(anime: Anime) {
    const result = await this.api.request({
      route: `anime/votes/${anime.kitsuId}`,
      method: HttpMethod.DELETE,
    });

    if (result.code === 0) {
      User.me.votesAvailable++;
      User.me.votedFor = User.me.votedFor.filter((id) => id != anime.kitsuId);
      User.update();
      this.getShows();
    }
  }
}
