import { ApiService, HttpMethod } from "./api.service";
import { Md5 } from "ts-md5/dist/md5";
import * as decode from "jwt-decode";

type Listener = () => void;

export class User {
  static me: User;

  private static listeners: Listener[] = [];

  constructor(
    public username: string,
    public admin: boolean,
    public votesAvailable: number,
    public votedFor: number[],
    public permissions: string[],
    public email?: string
  ) {}

  static listen(listener: Listener) {
    this.listeners.push(listener);
  }

  static async init(api: ApiService) {
    if (localStorage.getItem("token")) {
      try {
        const token = decode(localStorage.getItem("token"));
        const username = token["username"];

        const { code, data } = await api.request<User>({
          route: `users/${username}`,
          method: HttpMethod.GET,
        });

        if (code === 0) {
          this.me = data;

          this.update();

          return true;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    }
  }

  static update() {
    this.listeners.forEach((l) => l());
  }

  static getGravatar(user: User) {
    return `https://www.gravatar.com/avatar/${Md5.hashStr(
      user.email || user.username
    )}?d=identicon&r=r`;
  }
}
