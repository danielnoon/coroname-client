import { Injectable } from "@angular/core";
import firebase from "firebase/app";
import "firebase/messaging";
import { ApiService, HttpMethod } from "./api.service";

const config = {
  apiKey: "AIzaSyAQ6KdgwFIus2AGjeT8exHO2eFHoPgl18E",
  authDomain: "coroname-7e641.firebaseapp.com",
  databaseURL: "https://coroname-7e641.firebaseio.com",
  projectId: "coroname-7e641",
  storageBucket: "coroname-7e641.appspot.com",
  messagingSenderId: "140559718575",
  appId: "1:140559718575:web:4be6c234f440b740f51c5a",
  measurementId: "G-RTT2P99Z6J",
};

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  private static messaging: firebase.messaging.Messaging;
  private static vapid =
    "BBUhWtgAQN-b7hJhwLnf9wbqcStrfzCHsoupQ4ykXZpeQkQYbddj7CLpfcCyOIsFwHn0Nhr6llE0IKO-0aVJ4vg";

  constructor(private api: ApiService) {}

  initialize() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    FirebaseService.messaging = firebase.messaging();
  }

  async getToken() {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      return await FirebaseService.messaging.getToken({
        vapidKey: FirebaseService.vapid,
        serviceWorkerRegistration: registration,
      });
    } else {
      return undefined;
    }
  }

  async subscribe(token: string) {
    const response = await this.api.request<string>({
      route: "beta/notifications/all/subscriptions",
      method: HttpMethod.POST,
      body: JSON.stringify({ token }),
    });
    return response;
  }

  unsubscribe() {
    return FirebaseService.messaging.deleteToken();
  }
}
