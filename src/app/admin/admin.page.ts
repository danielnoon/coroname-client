import { Component, OnInit } from "@angular/core";
import { ApiService, HttpMethod } from "../api.service";
import { ToastController, ModalController } from "@ionic/angular";
import { User } from "../user";
import { UserEditorComponent } from "../user-editor/user-editor.component";
import { Anime } from "src/models/anime";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.page.html",
  styleUrls: ["./admin.page.scss"],
})
export class AdminPage implements OnInit {
  forms = {
    newUser: {
      username: "",
      admin: false,
      permissions: ["vote", "view anime"],
    },
    reset: {
      confirm: false,
    },
    customAnime: {
      title: "",
      poster: "",
      synopsis: "",
      nsfw: false,
      episodes: 0,
    },
  };

  users: User[];
  anime: Anime[];
  permissions: string[];

  constructor(
    private api: ApiService,
    private toast: ToastController,
    private modal: ModalController
  ) {}

  ngOnInit() {
    this.getUsers();
    this.getAnime();
    this.getPermissions();
  }

  async getUsers() {
    const { code, data } = await this.api.request<User[]>({
      route: "users",
      method: HttpMethod.GET,
    });

    if (code == 0) {
      this.users = data;
    }
  }

  async getAnime() {
    const { code, data } = await this.api.request<Anime[]>({
      route: "anime/shows",
      method: HttpMethod.GET,
    });

    if (code === 0) {
      this.anime = data;
    }
  }

  async getPermissions() {
    const { code, data } = await this.api.request<string[]>({
      route: "permissions",
      method: HttpMethod.GET,
    });

    if (code === 0) {
      this.permissions = data;
    }
  }

  async newAccount() {
    if (!this.forms.newUser.username) {
      this.api.error({ code: -1, message: "Username is required." });
      return;
    }

    const { code, data } = await this.api.request<User>({
      route: "users",
      method: HttpMethod.POST,
      body: JSON.stringify(this.forms.newUser),
    });

    if (code == 0) {
      const t = await this.toast.create({
        color: "success",
        message: `Created user ${data.username}`,
        position: "bottom",
        duration: 4000,
      });

      t.present();

      this.forms.newUser.username = "";
      this.forms.newUser.admin = false;

      this.users.push(data);
    }
  }

  async resetVotes() {
    if (!this.forms.reset.confirm) {
      this.api.error({ code: -1, message: "Please confirm your decision." });
      return;
    }

    const { code, data } = await this.api.request<string>({
      route: "anime/votes",
      method: HttpMethod.DELETE,
    });

    if (code == 0) {
      const t = await this.toast.create({
        color: "success",
        message: data,
        position: "bottom",
        duration: 4000,
      });

      t.present();
    }
  }

  async editUser(user: User) {
    const modal = await this.modal.create({
      component: UserEditorComponent,
      componentProps: { user },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      const t = await this.toast.create({
        color: "success",
        message: "success",
        position: "bottom",
        duration: 4000,
      });

      t.present();

      if (data.deleted) {
        const index = this.users.indexOf(user);
        this.users.splice(index, 1);
      }
    }
  }

  async addCustomAnime() {
    const response = await this.api.request({
      route: "anime/shows",
      method: HttpMethod.POST,
      body: JSON.stringify(this.forms.customAnime),
    });

    if (response.code === 0) {
      const t = await this.toast.create({
        color: "success",
        message: this.forms.customAnime.title + " created!",
        position: "bottom",
        duration: 4000,
      });

      t.present();

      this.forms.customAnime.title = "";
      this.forms.customAnime.poster = "";
      this.forms.customAnime.synopsis = "";
      this.forms.customAnime.nsfw = false;
      this.forms.customAnime.episodes = 0;
    }
  }
}
