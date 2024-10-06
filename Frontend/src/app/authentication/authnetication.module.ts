import { NgModule } from "@angular/core";
import { SigninComponent } from "./signin/signin.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedComponentsModule } from "../shared-components/shared-components.module";
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { AuthenticationRoutingModule } from "./authentication-routing.module";

@NgModule({
    declarations: [SigninComponent],
    imports: [
      CommonModule,
      AuthenticationRoutingModule,
      ReactiveFormsModule,
      FormsModule,
      MatCardModule,
      MatFormFieldModule,
      MatIconModule,
      SharedComponentsModule,
      MatCheckboxModule,
      MatButtonModule
    ]
  })
  export class AuthenticationModule { }
  