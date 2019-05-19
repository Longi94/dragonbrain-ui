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

  deleteProject(id: number): Observable<any> {
    return this.httpClient.delete(`${BASE}/${id}`);
  }

  moveProject(id: number, up: boolean): Observable<any> {
    const form = new FormData();
    if (up) {
      form.append('up', 'true');
    } else {
      form.append('up', 'false');
    }
    return this.httpClient.post(`${BASE}/${id}/move`, form);
  }

  updateProject(project: Project): Observable<any> {
    const options = {headers: {'Content-Type': 'application/json'}};
    return this.httpClient.put(`${BASE}/${project.id}`, JSON.stringify(project), options);
  }
}
