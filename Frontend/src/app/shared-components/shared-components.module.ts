import { NgModule } from "@angular/core";
import { FooterComponent } from "./footer/footer.component";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
    declarations: [FooterComponent],
    imports: [
      CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    RouterModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule
    ],
    exports: [FooterComponent],
  })
  export class SharedComponentsModule { }
  