import { Component, OnInit } from '@angular/core';
import { Project } from "../../../../model/project";
import { ProjectService } from "../../../../services/project.service";
import { MatDialogRef, MatSnackBar } from "@angular/material";

@Component({
  selector: 'app-edit-component',
  templateUrl: './edit-component.component.html',
  styleUrls: ['./edit-component.component.scss']
})
export class EditComponentComponent implements OnInit {

  project: Project = new Project();

  constructor(
    private dialogRef: MatDialogRef<EditComponentComponent>,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
  }

  createProject() {
    this.projectService.addProject(this.project).subscribe(project => {
      this.dialogRef.close(project);
    }, error => {
      this.snackBar.open(`Failed to create project: ${error.error.message}`, null, {duration: 2000});
    });
  }
}
