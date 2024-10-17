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

@NgModule({
  declarations: [HeaderComponent, LoadingSpinnerComponent, SideMenuComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule, 
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule
  ],
  exports: [HeaderComponent, LoadingSpinnerComponent, SideMenuComponent]
})
export class CoreComponentsModule { }
