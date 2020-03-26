import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss'],
})
export class UserPopoverComponent implements OnInit {
  admin = false;

  constructor(private pop: PopoverController, private router: Router) { }

  ngOnInit() {
    this.admin = User.me.admin;
  }

  dismiss() {
    this.pop.dismiss();
  }

  logOut() {
    localStorage.clear();
    this.router.navigateByUrl('/');
    this.dismiss();
  }
}
