import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ViewUpdateProfileComponent } from './view-update-profile/view-update-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [HeaderComponent, LoadingSpinnerComponent, SideMenuComponent, ViewUpdateProfileComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule, 
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  exports: [HeaderComponent, LoadingSpinnerComponent, SideMenuComponent, ViewUpdateProfileComponent]
})
export class CoreComponentsModule { }
