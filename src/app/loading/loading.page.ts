import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { User } from '../user';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.init();
  }

  async init() {
    if (localStorage.getItem('token')) {
      if (await User.init(this.api)) {
        this.router.navigateByUrl('/home');
      } else {
        this.router.navigateByUrl('/login');
      }
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
