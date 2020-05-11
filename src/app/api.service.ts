import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { Response } from "src/models/response";
import { Error } from "src/models/error";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  toastPopped = false;
  timeoutId: any = -1;
  toast: any;

  constructor(private toastController: ToastController) {}

  private constructEndpoint(route: string, query?: string) {
    return `${environment.api}/${route}${query ? "?" + query : ""}`;
  }

  async request<T>(options: {
    route: string;
    method: "get" | "post" | "put" | "delete" | "patch";
    headers?: Headers;
    query?: string;
    body?: string | FormData;
    showWarmup?: boolean;
  }): Promise<Response<T>> {
    try {
      let { route, method, headers, query, body } = options;
      let showWarmup =
        options.showWarmup === undefined ? true : options.showWarmup;

      if (!headers) {
        headers = new Headers();
      }

      if (localStorage.getItem("token")) {
        headers.append("auth-token", localStorage.getItem("token"));
      }

      if (method !== "get") {
        if (!headers.has("content-type")) {
          headers.append("content-type", "application/json");
        }
      }

      if (showWarmup) {
        this.setHerokuTimeout();
      }

      const response = await fetch(this.constructEndpoint(route, query), {
        method,
        headers,
        body,
      });

      this.clearHerokuTimeout();

      const json = (await response.json()) as Response<T> | Error;

      if (json.code == -1) {
        this.error(json as Error);
      }

      return json as Response<T>;
    } catch (err) {
      this.error(err);
    }
  }

  setHerokuTimeout() {
    if (this.timeoutId === -1) {
      this.timeoutId = setTimeout(async () => {
        this.toast = await this.toastController.create({
          color: "primary",
          message: "Hold on! The server is warming up...",
        });

        this.toastPopped = true;

        this.toast.present();
      }, 2500);
    }
  }

  clearHerokuTimeout() {
    if (this.timeoutId !== -1) {
      clearTimeout(this.timeoutId);
      this.timeoutId = -1;
    }

    if (this.toastPopped) {
      this.toast.dismiss();
    }
  }

  async error(err: Error) {
    const toast = await this.toastController.create({
      color: "danger",
      message: err.message,
      position: "bottom",
      duration: 4000,
    });
    toast.present();
  }
}
