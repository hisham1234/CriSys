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
    slideToggle: boolean;
    user: UserModel;

    ngOnInit(): void {
        this.authentication.userSubject.subscribe((user) => {
            this.user = user;
            if(user.refreshRate < 10) {
                this.slideToggle = false;
            } else{
                this.slideToggle = true;
            } 
        });
        this.authentication.emitUser();
    }


    save() {
        this.authentication.updateUserByToken(this.user).subscribe((user) => {
            this.authentication.updateUser(user);
        });
    }
    toggleChange() {
        this.slideToggle = !this.slideToggle;
        if(this.slideToggle == true) {
            this.user.refreshRate = 300;
        } else {
            this.user.refreshRate = 1;
        } 
        this.save();
    } 
}
