import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  user: User;
  @Output() sideNavToggled = new EventEmitter<void>();

  constructor(
    private authenticationService: AuthenticationService,
    private readonly router: Router
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit() {}

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
