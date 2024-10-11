import { NgModule } from "@angular/core";
import { FooterComponent } from "./footer/footer.component";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import {MatDividerModule} from '@angular/material/divider';
import { DeleteDialogComponent } from "./delete-dialog/delete-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { SearchBarComponent } from "./search-bar/search-bar.component";

@NgModule({
    declarations: [FooterComponent,DeleteDialogComponent, SearchBarComponent],
    imports: [
      CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    RouterModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
    ],
    exports: [FooterComponent, SearchBarComponent],
  })
  export class SharedComponentsModule { }
