import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { MatButtonModule, MatCardModule, MatIconModule, MatMenuModule, MatToolbarModule } from "@angular/material";
import { RouterModule } from "@angular/router";
import { ProjectsComponent } from './components/projects/projects.component';
import { AdminsComponent } from './components/admins/admins.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
  ],
  declarations: [MainComponent, ProjectsComponent, AdminsComponent],
  entryComponents: [MainComponent]
})
export class AdminModule { }
