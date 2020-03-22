import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Response } from 'src/models/response';
import { Error } from 'src/models/error';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private toastController: ToastController) { }

  private constructEndpoint(route: string, query?: string) {
    return `${environment.api}/${route}${query ? '?' + query : ''}`;
  }

  async request<T>(options: {
    route: string;
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    headers?: Headers;
    query?: string;
    body?: string | FormData;
  }): Promise<Response<T>> {
    try {
      let { route, method, headers, query, body } = options;

      if (!headers) {
        headers = new Headers();
      }

      if (localStorage.getItem('token')) {
        headers.append('auth-token', localStorage.getItem('token'));
      }

      if (method !== 'get') {
        if (!headers.has('content-type')) {
          headers.append('content-type', 'application/json');
        }
      }

      const response = await fetch(this.constructEndpoint(route, query), {
        method,
        headers,
        body
      });

      const json = (await response.json()) as Response<T> | Error;

      if (json.code == -1) {
        this.error(json as Error);
      }
      
      return json as Response<T>;
    } catch (err) {
      this.error(err);
    }
  }

  async error(err: Error) {
    const toast = await this.toastController.create({
      color: 'danger',
      message: err.message,
      position: 'bottom',
      duration: 4000
    });
    toast.present();
  }
}
