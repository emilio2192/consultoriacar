import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {MainComponent} from './main/main.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CaseDetailComponent } from './admin/case-detail/case-detail.component';
import {UsersComponent} from './admin/users/users.component';
import { SignoutComponent } from './admin/signout/signout.component';
import {ForgotpwdComponent} from './auth/forgotpwd/forgotpwd.component';
import{CorrelativeComponent} from './admin/correlative/correlative.component';

const routes: Routes = [
  {path:'', component: LoginComponent},
  {path:'login', component: LoginComponent},
  {path:'forgotpwd', component: ForgotpwdComponent},
  {path:'main', component: MainComponent, children:[
    {path:'dashboard', component: DashboardComponent},
    {path:'users', component: UsersComponent},
    {path:'correlative', component: CorrelativeComponent},
    {path:'detail/:correlative', component: CaseDetailComponent},
    {path:'signout', component: SignoutComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
