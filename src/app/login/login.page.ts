import { Component, OnInit } from '@angular/core';
import { TokenResponse } from 'src/models/token-response';
import { Router } from '@angular/router';
import { ApiService } from '../api-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string;
  password: string;

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {}

  async submit() {
    const username = this.username;
    const password = this.password;

    const res = await this.api.request<TokenResponse>({
      route: 'auth/login',
      method: 'post',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ username, password })
    });
    
    if (res.code == 0) {
      const token = res.data.token;

      localStorage.setItem('token', token);

      this.router.navigateByUrl('/home');
    }
  }

}
