import { Component, OnInit } from '@angular/core';
import { ProjectService } from "../../../services/project.service";
import { Project } from "../../../model/project";
import { MatDialog } from "@angular/material";
import { EditComponentComponent } from "./edit-component/edit-component.component";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];

  constructor(private projectService: ProjectService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.projects = this.projects.sort((a, b) => a.orderBy - b.orderBy);
    }, error => console.error(error));
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(EditComponentComponent, {
      width: '500px'
    });
  }
}
