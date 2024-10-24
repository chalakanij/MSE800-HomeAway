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
import { SignupComponent } from './signup/signup.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { LandingComponent } from './landing/landing.component';
import { SignupEmployeeComponent } from "./signup-employee/signup-employee.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";


@NgModule({
    declarations: [SigninComponent, SignupComponent, SignupEmployeeComponent, LandingComponent],
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
      MatButtonModule,
      MatSelectModule,
      MatOptionModule,
      MatInputModule,
      MatSnackBarModule
    ]
  })
  export class AuthenticationModule { }
  