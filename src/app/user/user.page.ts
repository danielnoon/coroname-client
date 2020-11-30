import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { ApiService, HttpMethod } from "../api.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.page.html",
  styleUrls: ["./user.page.scss"],
})
export class UserPage implements OnInit {
  user: User;
  username = "";
  password = "";
  email = "";

  constructor(private api: ApiService) {}

  ngOnInit() {
    if (User.me) {
      this.user = User.me;
      this.username = this.user.username;
      this.email = this.user.email;
    }

    User.listen(() => {
      this.user = User.me;
      this.username = this.user.username;
      this.email = this.user.email;
    });
  }

  getGravatar() {
    return User.getGravatar(this.user);
  }

  async update() {
    const { code } = await this.api.request({
      route: `users/${this.user.username}`,
      method: HttpMethod.PATCH,
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        email: this.email,
      }),
    });

    if (code === 0) {
      this.user.email = this.email;
      this.user.username = this.username;
      User.update();
    }
  }
}
