import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Office } from 'src/app/models/office.model';
import { Role } from 'src/app/models/role.model';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

    userList: UserModel[];

    displayedColumns = ['ID', 'Email', 'Office', 'Roles'];
    dataSource = new MatTableDataSource<UserModel>();
    searchText = ''
    totalSize: number;
    title = $localize`List Of Users`;
    loading = true;

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    constructor(
        private userService: UserService,
        public dialog: MatDialog,
        private router: Router,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.getAllUsers();
    }

    public doFilter = (value: string) => {
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }

    public goToUserDetails(user: UserModel) {
        console.log(user);
    }

    getAllUsers() {
        this.userService.getAll().subscribe((res) => {
            this.dataSource.data = res as UserModel[];
            this.totalSize = res.length;
            this.loading = false;

            console.log(this.dataSource);
        });
    }

    formatRoles(roles: Role[]) {
        let res = '';
        if(roles === undefined || roles.length === 0 ) {
            return 'none';
        } else {
            roles.forEach(role =>  {
                res = res + role.roleName + ', '
            });
            return res.substring(0, res.length - 2);;
        }
        
    }

    formatOffice(office: Office) {
        if(office === undefined || office == null) {
            return 'none';
        } else {
            return office.officeName;
        }
    }
}
