import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  login(username: string, password: string): Observable<any> {
    const  formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    return this.httpClient.post(`${environment.backend}/auth`, formData).pipe(
      tap(
        () => {
          localStorage.setItem('username', username);
          localStorage.setItem('token', btoa(`${username}:${password}`));
        },
        () => {
          localStorage.clear();
        }
      )
    )
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']).then();
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') != null;
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }
}
