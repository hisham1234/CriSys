import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { AuthModel } from '../models/auth.model';
import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    user: UserModel;
    userSubject = new Subject<UserModel>();


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
                    return auth;
                })
            );
    }

    putUserByToken(user: UserModel) {
        return
    }

    getUserByToken() {
        console.log('AuthService.getUserByToken!');
        return this.http
            .get<UserModel>(`${environment.organizationUrl}/api/accounts/me`);
    }

    updateUserByToken(user: UserModel) {
        return this.http.put<UserModel>(`${environment.organizationUrl}/api/accounts/me`, user)
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }



    emitUser() {
        this.userSubject.next({ ...this.user });
    }

    updateUser(user: UserModel) {
        this.user = user;
        this.emitUser();
    }
}
