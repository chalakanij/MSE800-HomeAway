import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './project-module/project/projects/projects.component';
import { EmployerComponent } from './employer-module/employer/employer/employer.component';
import { TimeLogsComponent } from './time-logs-module/time-logs/time-logs/time-logs.component';


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
    path: 'time-logs',
    component: TimeLogsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
