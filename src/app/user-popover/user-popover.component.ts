import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { PopoverController, ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { FirebaseService } from "../firebase.service";

@Component({
  selector: "app-user-popover",
  templateUrl: "./user-popover.component.html",
  styleUrls: ["./user-popover.component.scss"],
})
export class UserPopoverComponent implements OnInit {
  admin = false;
  theme = "light";
  defaultTheme = "light";
  nonDefaultTheme = false;
  showNotifications = true;
  notificationsEnabled = true;
  installed = false;

  constructor(
    private pop: PopoverController,
    private router: Router,
    private firebase: FirebaseService,
    private toast: ToastController
  ) {}

  ngOnInit() {
    if (User.me) {
      this.admin =
        User.me.admin || User.me.permissions.includes("view admin dashboard");
    }

    User.listen(() => {
      this.admin =
        User.me.admin || User.me.permissions.includes("view admin dashboard");
    });

    const darkThemeDefault = matchMedia
      ? matchMedia("(prefers-color-scheme: dark)").matches
      : false;
    if (darkThemeDefault) {
      this.defaultTheme = "dark";
    } else {
      this.defaultTheme = "light";
    }
    this.theme = localStorage.getItem("theme") || this.defaultTheme;
    if (this.theme !== this.defaultTheme) {
      this.nonDefaultTheme = true;
    }

    if (!Notification) {
      this.showNotifications = false;
    }

    const optIn = localStorage.getItem("notificationOptIn");

    if (Notification.permission === "granted" && optIn === "true") {
      this.firebase.getToken().then((token) => {
        if (!token) {
          this.notificationsEnabled = false;
        }
      });
    } else if (Notification.permission === "denied") {
      this.showNotifications = false;
    } else {
      this.notificationsEnabled = false;
    }

    if ((navigator as any).standalone) {
      this.installed = true;
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      this.installed = true;
    }
  }

  toggleNotifications() {
    if (this.notificationsEnabled) {
      this.disableNotifications();
    } else {
      this.enableNotifications();
    }
  }

  async enableNotifications() {
    this.firebase.initialize();
    const token = await this.firebase.getToken();
    if (token) {
      this.firebase.subscribe(token);
      this.notificationsEnabled = true;
      this.toast
        .create({
          message: "Enabled notifications!",
          color: "success",
          duration: 3000,
        })
        .then((toast) => toast.present());
    } else {
      this.toast
        .create({
          message: "Failed to enable notifications.",
          color: "danger",
          duration: 3000,
        })
        .then((toast) => toast.present());
    }
    localStorage.setItem("notificationOptIn", "true");
  }

  async disableNotifications() {
    await this.firebase.unsubscribe();
    this.notificationsEnabled = false;
    this.toast
      .create({
        message: "Disabled notifications!",
        color: "success",
        duration: 3000,
      })
      .then((toast) => toast.present());
    localStorage.setItem("notificationOptIn", "false");
  }

  dismiss() {
    this.pop.dismiss();
  }

  logOut() {
    localStorage.clear();
    this.firebase.unsubscribe();
    this.router.navigateByUrl("/");
    this.dismiss();
  }

  switchTheme() {
    if (this.theme === "light") {
      this.theme = "dark";
      localStorage.setItem("theme", "dark");
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      this.theme = "light";
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }

    if (this.theme !== this.defaultTheme) {
      this.nonDefaultTheme = true;
    }
  }
}
