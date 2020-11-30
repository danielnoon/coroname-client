import { Component, OnInit } from "@angular/core";
import { TokenResponse } from "src/models/token-response";
import { Router } from "@angular/router";
import { ApiService, HttpMethod } from "../api.service";
import { User } from "../user";
import { PopoverController } from "@ionic/angular";
import { LoginHelpPopoverComponent } from "../login-help-popover/login-help-popover.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;

  constructor(
    private router: Router,
    private api: ApiService,
    private pop: PopoverController
  ) {}

  ngOnInit() {}

  async submit() {
    const username = this.username;
    const password = this.password;

    const res = await this.api.request<TokenResponse>({
      route: "auth/login",
      method: HttpMethod.POST,
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ username, password }),
    });

    if (res.code == 0) {
      const token = res.data.token;

      localStorage.setItem("token", token);

      User.init(this.api);

      this.router.navigateByUrl("/home");
    }
  }

  async showHelpPopover(ev: MouseEvent) {
    const pop = await this.pop.create({
      component: LoginHelpPopoverComponent,
      event: ev,
    });

    await pop.present();
  }
}
