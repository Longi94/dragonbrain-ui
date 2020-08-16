import { Component, Inject, OnInit } from '@angular/core';
import { Project } from "../../../../model/project";
import { ProjectService } from "../../../../services/project.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-edit-component',
  templateUrl: './edit-component.component.html',
  styleUrls: ['./edit-component.component.scss']
})
export class EditComponentComponent implements OnInit {

  project: Project = new Project();
  edit: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<EditComponentComponent>,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {
    if (data) {
      this.project = Project.clone(data);
      this.edit = true;
    }
  }

  ngOnInit() {
  }

  submitProject() {
    if (this.edit) {
      this.projectService.updateProject(this.project).subscribe(project => {
        this.dialogRef.close(project);
      }, error => {
        this.snackBar.open(`Failed to update project: ${error.error.message}`, null, {duration: 2000});
      });
    } else {
      this.projectService.addProject(this.project).subscribe(project => {
        this.dialogRef.close(project);
      }, error => {
        this.snackBar.open(`Failed to create project: ${error.error.message}`, null, {duration: 2000});
      });
    }
  }
}
