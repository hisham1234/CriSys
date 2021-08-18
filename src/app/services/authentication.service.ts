import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { AuthModel } from '../models/auth.model';
import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  constructor(private router: Router, private http: HttpClient) {
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.organizationUrl}/api/accounts/login`, {
        "Email": email,
        "Password": password,
      })
      .pipe(
        map((auth: AuthModel) => {       
          localStorage.setItem('token', auth.token);
          //this.userSubject.next(auth);
          return auth;
        })
      );
  }


  getUserByToken() {
    console.log('AuthService.getUserByToken!');
    // const userToken = localStorage.getItem('token');
    // const headers = new HttpHeaders({
    //     'Content-Type': 'application/json; charset=utf-8',
    //     'Authorization': 'Bearer ' + userToken
    //});
    return this.http.get<any>(`${environment.organizationUrl}/api/accounts/me`);
    }

  logout() {  
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
