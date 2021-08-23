import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { UserModel } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  loggedUser: UserModel;
  userFirstName = '';
  txtSignOutText =$localize`Sign out` 
  @Output() sideNavToggled = new EventEmitter<void>();

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private readonly router: Router
  ) {
  }

  languageList = [  
    // { code: 'en', label: 'English' },  
   /*  { code: 'jp', label: '日本語' },   */
  
  ];  

  ngOnInit() {

    // Request LoggedUser
      this.authenticationService.getUserByToken().subscribe(res => {
          this.authenticationService.updateUser(res);
      });

      // Subscribe modification on the user loggedUser
      this.authenticationService.userSubject.subscribe(res => {
          this.loggedUser = res;
      });


    // this.userService
    //   .getById(this.user.id)
    //   .pipe(first())
    //   .subscribe((user) => {
    //     this.loggedUser = user;
    //   });

    
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
