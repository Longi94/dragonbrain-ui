import { Component, OnInit } from '@angular/core';
import { ProjectService } from "../../../services/project.service";
import { Project } from "../../../model/project";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.projects = this.projects.sort((a, b) => a.orderBy - b.orderBy);
    }, error => console.error(error));
  }

}
