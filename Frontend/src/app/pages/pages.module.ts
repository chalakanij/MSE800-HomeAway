import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRippleModule} from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';

import { PagesRoutingModule } from './pages.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from './employee-module/employee/employee/employee.component';
import { AddProjectComponent } from './project-module/add-project/add-project/add-project.component';
import { UpdateProjectComponent } from './project-module/update-project/update-project/update-project.component';
import { DeleteProjectComponent } from './project-module/delete-project/delete-project/delete-project.component';
import { ProjectsComponent } from './project-module/project/projects/projects.component';
import { TimeLogsComponent } from './time-logs-module/time-logs/time-logs/time-logs.component';
import { AddTimeLogsComponent } from './time-logs-module/add-time-logs/add-time-logs/add-time-logs.component';
import { UpdateTimeLogsComponent } from './time-logs-module/update-time-logs/update-time-logs/update-time-logs.component';
import { DeleteTimeLogsComponent } from './time-logs-module/delete-time-logs/delete-time-logs/delete-time-logs.component';

@NgModule({
  declarations: [DashboardComponent, EmployeeComponent, AddProjectComponent, UpdateProjectComponent, DeleteProjectComponent,
    ProjectsComponent, TimeLogsComponent, AddTimeLogsComponent, UpdateTimeLogsComponent, DeleteTimeLogsComponent
  ],
  imports: [
    PagesRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatPaginatorModule,
    CommonModule,
    SharedComponentsModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule,
    MatStepperModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule
  ],

  exports: []
})
export class PagesComponentsModule { }
