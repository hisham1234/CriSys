import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { Role } from '../models/role';

const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    firstName: 'Admin',
    lastName: 'Admin',
    role: Role.Admin,
  },
  {
    id: 2,
    username: 'user',
    password: 'user',
    firstName: 'User',
    lastName: 'User',
    role: Role.User,
  },

  {
    id: 3,
    username: 'user1',
    password: 'user1',
    firstName: 'User1',
    lastName: 'User1',
    role: Role.User1,
  },
  {
    id: 4,
    username: 'user2',
    password: 'user2',
    firstName: 'User2',
    lastName: 'User2',
    role: Role.User2,
  },
];

@Injectable()
export class TestBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;
    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    function authenticate() {
      const { username, password } = body;
      const user = users.find(
        (x) => x.username === username && x.password === password
      );
      if (!user) return error('ID or password is incorrect');
      return isOk({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: `test-jwt-token.${user.id}`,
      });
    }

    function getUsers() {
      if (!isAdmin()) return unauthorized();
      return isOk(users);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();
   
      if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

      const user = users.find((x) => x.id === idFromUrl());
      return isOk(user);
    }
  
    function isOk(body: any) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function unauthorized() {
      return throwError({
        status: 401,
        error: { message: 'unauthorized' },
      }).pipe(materialize(), delay(500), dematerialize()); 
    }

    function error(message: any) {
      return throwError({ status: 400, error: { message } }).pipe(
        materialize(),
        delay(500),
        dematerialize()
      );
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer test-jwt-token');
    }

    function isAdmin() {
      return isLoggedIn() && currentUser().role === Role.Admin;
    }

    function currentUser() {
      // if (!isLoggedIn()) {
      //   return " ";
      // } else {
      const id = parseInt(headers.get('Authorization').split('.')[1]);

      return users.find((x) => x.id === id);
      //  }

      //  if (!isLoggedIn()) return;
      //     const id = parseInt(headers.get('Authorization').split('.')[1]);
      //   return users.find((x) => x.id === id);
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const testBackendProvider = { 
  provide: HTTP_INTERCEPTORS,
  useClass: TestBackendInterceptor,
  multi: true,
};
