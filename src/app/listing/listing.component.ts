import { Component, OnInit, Input } from '@angular/core';
import { Anime } from 'src/models/anime';
import { ApiService } from '../api-service.service';
import { User } from '../user';
import { ModalController, PopoverController } from '@ionic/angular';
import { VoterDetailsComponent } from '../voter-details/voter-details.component';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
})
export class ListingComponent implements OnInit {

  @Input() anime: Anime;
  votedFor = false;
  admin = false;
  voters: User[];

  constructor(private api: ApiService, private modal: ModalController, private popover: PopoverController) { }

  ngOnInit() {
    if (User.me) {
      this.votedFor = User.me.votedFor.includes(this.anime.kitsuId);
      this.admin = User.me.admin;
    }

    User.listen(() => {
      this.votedFor = User.me.votedFor.includes(this.anime.kitsuId);
      this.admin = User.me.admin;
    });

    this.getVoters();
  }

  async vote() {
    const result = await this.api.request({
      route: 'anime/vote',
      method: 'post',
      body: JSON.stringify({ id: this.anime.kitsuId })
    });

    if (result.code === 0) {
      this.anime.votes++;
      this.votedFor = true;
      User.me.votesAvailable--;
      User.update();
    }
  }

  async rescind() {
    const result = await this.api.request({
      route: 'anime/rescind',
      method: 'post',
      body: JSON.stringify({ id: this.anime.kitsuId })
    });

    if (result.code === 0) {
      this.anime.votes--;
      this.votedFor = false;
      User.me.votesAvailable++;
      User.update();
    }
  }

  async setAsCS() {
    const result = await this.api.request({
      route: 'anime/continuing-series',
      method: 'post',
      body: JSON.stringify({ id: this.anime.kitsuId })
    });

    if (result.code === 0) {
      location.reload();
    }
  }

  async getVoters() {
    const result = await this.api.request<User[]>({
      route: `anime/${this.anime.kitsuId}/voters`,
      method: 'get'
    });

    if (result.code === 0) {
      this.voters = result.data;
    }
  }

  getGravatar(user: User) {
    return User.getGravatar(user);
  }

  async openVoterDetails(ev: MouseEvent) {
    if (window.innerWidth < 600) {
      const modal = await this.modal.create({
        component: VoterDetailsComponent,
        componentProps: {
          users: this.voters
        }
      });

      modal.present();
    } else {
      const popover = await this.popover.create({
        component: VoterDetailsComponent,
        componentProps: {
          users: this.voters
        },
        event: ev,
        showBackdrop: false
      });

      popover.present();
    }
  }
}
