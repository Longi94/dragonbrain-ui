import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Project } from "../model/project";
import { environment } from "../../environments/environment";

const BASE = `${environment.backend}/api/projects`;

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) {
  }

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(BASE);
  }

  addProject(project: Project): Observable<Project> {
    const options = {headers: {'Content-Type': 'application/json'}};
    return this.httpClient.post<Project>(BASE, JSON.stringify(project), options);
  }
}
