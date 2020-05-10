import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { PopoverController } from "@ionic/angular";
import { Router } from "@angular/router";

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

  constructor(private pop: PopoverController, private router: Router) {}

  ngOnInit() {
    if (User.me) {
      this.admin = User.me.admin;
    }

    User.listen(() => {
      this.admin = User.me.admin;
    });

    const darkThemeDefault = matchMedia
      ? matchMedia("prefers-color-scheme: dark")
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
  }

  dismiss() {
    this.pop.dismiss();
  }

  logOut() {
    localStorage.clear();
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
