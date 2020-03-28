import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './user';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private api: ApiService, private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    if (await User.init(this.api)) {
      if (next.url[0] && next.url[0].path === 'admin') {
        if (User.me.admin) {
          return true;
        } else {
          return this.router.parseUrl('/home');
        }
      } else {
        return true;
      } 
    } else {
      return this.router.parseUrl('/login');
    }
  }
}
