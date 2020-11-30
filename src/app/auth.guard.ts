import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { User } from "./user";
import { ApiService } from "./api.service";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private api: ApiService,
    private router: Router,
    private loading: LoadingController
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    let user: User;

    if (!User.me) {
      const loading = await this.loading.create();
      if (state.url[0]) {
        await loading.present();
      }
      const success = await User.init(this.api);
      loading.dismiss();
      if (success) {
        user = User.me;
      } else {
        return this.router.parseUrl("/login");
      }
    } else {
      user = User.me;
    }

    if (next.url[0] && next.url[0].path === "admin") {
      if (
        User.me.admin ||
        User.me.permissions.includes("view admin dashboard") ||
        User.me.permissions.includes("admin")
      ) {
        return true;
      } else {
        return this.router.parseUrl("/home");
      }
    } else {
      return true;
    }
  }
}
