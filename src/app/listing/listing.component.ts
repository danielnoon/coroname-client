import { Component, OnInit, Input } from '@angular/core';
import { Anime } from 'src/models/anime';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
})
export class ListingComponent implements OnInit {

  @Input() anime: Anime;

  constructor() { }

  ngOnInit() {}

}
