import { Component, Input, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { range } from "../../util/range";

@Component({
  selector: "app-episode-select-popover",
  templateUrl: "./episode-select-popover.component.html",
  styleUrls: ["./episode-select-popover.component.scss"],
})
export class EpisodeSelectPopoverComponent implements OnInit {
  @Input() episode: number;
  @Input() maxEpisode: number;
  @Input() update: (ep: number) => void;

  episodes: number[] = [];

  constructor(private pop: PopoverController) {}

  ngOnInit() {
    this.episodes = range(this.maxEpisode + 1).arr;
  }

  change(v: CustomEvent) {
    this.update(v.detail.value);
    this.pop.dismiss();
  }
}
