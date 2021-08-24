import { Injectable } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ThemeService } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    // It should return 'true' for development environment
    //so it is not needed to log in when developing. 
    if (!environment.production) {
      return true;
    }

    const token = localStorage.getItem('token');
    if (token) {
      //if (route.data.roles && route.data.roles.indexOf(user.role) === -1) {
        if (route.data.roles) {
            this.router.navigate(['/']);
            return false;
      }
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
