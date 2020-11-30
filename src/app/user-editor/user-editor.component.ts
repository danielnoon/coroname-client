import { Component, OnInit, Input } from "@angular/core";
import { User } from "../user";
import { ApiService, HttpMethod } from "../api.service";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-user-editor",
  templateUrl: "./user-editor.component.html",
  styleUrls: ["./user-editor.component.scss"],
})
export class UserEditorComponent implements OnInit {
  @Input() user: User;

  newUsername: string;
  resetPassword = false;
  admin: boolean;
  votes: number;

  constructor(private api: ApiService, private modal: ModalController) {}

  ngOnInit() {
    this.newUsername = this.user.username;
    this.admin = this.user.admin;
    this.votes = this.user.votesAvailable;
  }

  dismiss() {
    this.modal.dismiss();
  }

  async deleteUser() {
    const { code, data } = await this.api.request({
      route: "admin/user/" + this.user.username,
      method: HttpMethod.DELETE,
    });

    if (code === 0) {
      this.modal.dismiss({
        deleted: true,
      });
    }
  }

  async edit() {
    const { code, data } = await this.api.request({
      route: "users/" + this.user.username,
      method: HttpMethod.PATCH,
      body: JSON.stringify({
        username: this.newUsername,
        resetPassword: this.resetPassword,
        admin: this.admin,
        votes: this.votes,
      }),
    });

    if (code === 0) {
      this.user.username = this.newUsername;
      this.user.admin = this.admin;
      this.user.votesAvailable = this.votes;

      this.modal.dismiss({
        deleted: false,
      });
    }
  }
}
