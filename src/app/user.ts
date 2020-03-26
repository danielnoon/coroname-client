import * as jwtDecode from 'jwt-decode';
import { ApiService } from './api-service.service';
import { Md5 } from 'ts-md5/dist/md5';

type Listener = () => void;

export class User {
  static me: User;

  private static listeners: Listener[] = [];

  constructor(
    public username: string,
    public admin: boolean,
    public votesAvailable: number,
    public votedFor: number[],
    public email?: string
  ) {}

  static listen(listener: Listener) {
    this.listeners.push(listener);
  }

  static async load(api: ApiService) {
    if (localStorage.getItem('token')) {
      const { data } = await api.request<{ token: string }>({
        route: 'auth/new-token',
        method: 'get'
      });

      const token = data.token;
      const user = jwtDecode(token);

      const username = user['sub'];
      const admin = user['admin'];
      const votesAvailable = user['votesAvailable'];
      const votedFor = user['votedFor'];
      const email = user['votedFor'];

      this.me = new User(username, admin, votesAvailable, votedFor, email);

      this.update();
    }
  }

  static update() {
    this.listeners.forEach(l => l());
  }

  static getGravatar(user: User) {
    return `https://www.gravatar.com/avatar/${ Md5.hashStr(user.email || user.username) }?d=identicon`
  }
}