import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-display-settings',
  templateUrl: './display-settings.component.html',
  styleUrls: ['./display-settings.component.css']
})
export class DisplaySettingsComponent implements OnInit {

  constructor(private authentication: AuthenticationService) { }

  user: UserModel;
  refreshRate: number;
  ngOnInit(): void {
      this.authentication.userSubject.subscribe((user) => {
        this.user = user;
        this.refreshRate = user.refreshRate;
      });
      this.authentication.emitUser();
  }


  save(){
      //this.user.refreshRate = this.refreshRate;
      this.authentication.updateUserByToken(this.user).subscribe((user) => {
        this.authentication.updateUser(user);  
      });
    }

}
