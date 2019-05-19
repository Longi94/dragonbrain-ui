import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { ProjectsComponent } from './components/projects/projects.component';
import { AdminsComponent } from './components/admins/admins.component';
import { EditComponentComponent } from './components/projects/edit-component/edit-component.component';
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  declarations: [MainComponent, ProjectsComponent, AdminsComponent, EditComponentComponent],
  entryComponents: [MainComponent, EditComponentComponent]
})
export class AdminModule { }
