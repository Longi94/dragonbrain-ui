import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../model/project';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditComponentComponent } from './edit-component/edit-component.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];

  constructor(private projectService: ProjectService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.sortProjects();
    }, error => console.error(error));
  }

  private sortProjects() {
    this.projects = this.projects.sort((a, b) => a.orderBy - b.orderBy);
  }

  moveProject(project: Project, up: boolean) {
    this.projectService.moveProject(project.id, up).subscribe(() => {
      const index = this.projects.indexOf(project);
      if (index > -1) {
        if (up && index > 0) {
          const other = this.projects[index - 1];
          const tmp = other.orderBy;
          other.orderBy = project.orderBy;
          project.orderBy = tmp;
          this.sortProjects();
        } else if (!up && index < this.projects.length - 1) {
          const other = this.projects[index + 1];
          const tmp = other.orderBy;
          other.orderBy = project.orderBy;
          project.orderBy = tmp;
          this.sortProjects();
        }
      }
    }, error => {
      this.snackBar.open(`Failed to move ${project.name}: ${error.error.message}`, null, {duration: 2000});
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(EditComponentComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(project => {
      if (project) {
        this.projects.push(project);
        this.sortProjects();
      }
    });
  }

  openEditDialog(project: Project) {
    const dialogRef = this.dialog.open(EditComponentComponent, {
      width: '500px',
      data: project
    });

    dialogRef.afterClosed().subscribe(newProject => {
      if (newProject) {
        const index = this.projects.indexOf(project);
        if (index > -1) {
          this.projects[index] = newProject;
          this.sortProjects();
        }
      }
    });
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: `Delete ${project.name}?`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(project.id).subscribe(() => {
          this.snackBar.open(`${project.name} deleted`, null, {duration: 2000});
          const index = this.projects.indexOf(project);
          if (index > -1) {
            this.projects.splice(index, 1);
          }
        }, error => {
          this.snackBar.open(`Failed to delete ${project.name}: ${error.error.message}`, null, {duration: 2000});
        });
      }
    });
  }
}
