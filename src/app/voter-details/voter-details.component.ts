import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-voter-details',
  templateUrl: './voter-details.component.html',
  styleUrls: ['./voter-details.component.scss'],
})
export class VoterDetailsComponent {
  @Input() users: User[];

  constructor() { }

  getIcon(user: User) {
    return User.getGravatar(user);
  }

}
