import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {  
      //console.log(`${environment.organizationUrl}/api/users`)
    return this.http.get<UserModel[]>(`${environment.organizationUrl}/api/users`);
  }

  getById(id: number) {
    return this.http.get<UserModel>(`${environment.organizationUrl}/users/${id}`);
  }
}
