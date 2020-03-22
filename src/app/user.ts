import * as jwtDecode from 'jwt-decode';
import { ApiService } from './api-service.service';

type Listener = () => void;

export class User {
  static username: string;
  static admin: boolean;
  static votesAvailable: number;
  static votedFor: number[];

  private static listeners: Listener[] = [];

  constructor(
    public username: string,
    public admin: boolean,
    public votesAvailable: number,
    public votedFor: number[]
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

      this.username = user['sub'];
      this.admin = user['admin'];
      this.votesAvailable = user['votesAvailable'];
      this.votedFor = user['votedFor'];

      this.update();
    }
  }

  static update() {
    this.listeners.forEach(l => l());
  }
}