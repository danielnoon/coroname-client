import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LoginPageRoutingModule } from "./login-routing.module";

import { LoginPage } from "./login.page";
import { LoginHelpPopoverComponent } from "../login-help-popover/login-help-popover.component";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LoginPageRoutingModule],
  declarations: [LoginPage, LoginHelpPopoverComponent],
  entryComponents: [LoginHelpPopoverComponent],
})
export class LoginPageModule {}
