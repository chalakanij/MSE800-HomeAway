import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './scaffoldings/blank/blank.component';
import { FullComponent } from './scaffoldings/full/full.component';

const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    // canActivate: [AuthGuard],
    data: { type: ['login']},
    children: [
      {
        path: '',
      }
    ]
  },
  {
    path: '',
    component: FullComponent,
    // canActivate: [AuthGuard],
    data: { type: ['routing']},
    children: [
      {
        path: 'app',   
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
