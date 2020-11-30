import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-episode-select-popover",
  templateUrl: "./episode-select-popover.component.html",
  styleUrls: ["./episode-select-popover.component.scss"],
})
export class EpisodeSelectPopoverComponent {
  @Input() episode: number;
  @Input() update: (ep: number) => void;

  constructor() {}
}
