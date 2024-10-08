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
        loadChildren: () => import('./authentication/authnetication.module').then((m) => m.AuthenticationModule)
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
        loadChildren: () => import('./pages/pages.module').then((m) => m.PagesComponentsModule) 
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
