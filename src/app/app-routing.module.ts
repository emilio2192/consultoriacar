import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {MainComponent} from './main/main.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CaseDetailComponent } from './admin/case-detail/case-detail.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'main', component: MainComponent, children:[
    {path:'dashboard', component: DashboardComponent},
    {path:'detail', component: CaseDetailComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
