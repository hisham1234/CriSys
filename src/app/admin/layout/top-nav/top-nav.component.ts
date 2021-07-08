import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  user: User;
  loggedUser: User;
  @Output() sideNavToggled = new EventEmitter<void>();

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private readonly router: Router
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit() {
    this.userService
      .getById(this.user.id)
      .pipe(first())
      .subscribe((user) => {
        this.loggedUser = user;
      });
  }

  toggleSidebar() {
    this.sideNavToggled.emit();
  }

  goToHomePage() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authenticationService.logout();
  }

  onLoggedout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
