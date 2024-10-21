import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './project-module/project/projects/projects.component';
import { TimeLogsComponent } from './time-logs-module/time-logs/time-logs/time-logs.component';
import { EmployeeComponent } from './employee-module/employee/employee.component';
import { EmployerComponent } from './employer-module/employer/employer.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    // canActivate: [RoleGuard],
  },
  {
    path: 'employers',
    component: EmployerComponent
  },
  {
    path: 'employees',
    component: EmployeeComponent
  },
  {
    path: 'time-logs',
    component: TimeLogsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
