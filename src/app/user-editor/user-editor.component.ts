import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';
import { ApiService } from '../api-service.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss'],
})
export class UserEditorComponent implements OnInit {
  @Input() user: User;

  newUsername: string;
  resetPassword = false;
  admin: boolean;

  constructor(private api: ApiService, private modal: ModalController) { }

  ngOnInit() {
    this.newUsername = this.user.username;
    this.admin = this.user.admin;
  }

  async deleteUser() {
    const { code, data } = await this.api.request({
      route: 'admin/user/' + this.user.username,
      method: 'delete'
    });

    if (code === 0) {
      this.modal.dismiss({
        deleted: true
      });
    }
  }

  async edit() {
    const { code, data } = await this.api.request({
      route: 'admin/user/' + this.user.username,
      method: 'put',
      body: JSON.stringify({
        username: this.newUsername,
        resetPassword: this.resetPassword,
        admin: this.admin
      })
    });

    if (code === 0) {
      this.user.username = this.newUsername;
      this.user.admin = this.admin;

      this.modal.dismiss({
        deleted: false
      });
    }
  }
}
