import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { MainComponent } from "./admin/components/main/main.component";
import { ProjectsComponent } from "./admin/components/projects/projects.component";
import { AdminsComponent } from "./admin/components/admins/admins.component";
import { HomeComponent } from "./components/home/home.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/admin/projects'
      },
      {
        path: 'projects',
        component: ProjectsComponent
      },
      {
        path: 'admins',
        component: AdminsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
