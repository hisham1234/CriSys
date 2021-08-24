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

    ngOnInit(): void {
        this.authentication.userSubject.subscribe((user) => {
            this.user = user;
        });
        this.authentication.emitUser();
    }


    save() {
        this.authentication.updateUserByToken(this.user).subscribe((user) => {
            this.authentication.updateUser(user);
        });
    }

}
