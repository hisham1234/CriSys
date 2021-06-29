import { Component, OnInit } from '@angular/core';
import {childRoutes } from "../../../components/child-routes";
import {UserModel} from "../../../models/user.model";
import {RouterExtService} from "../../../services/router-ext.service";
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  showMenu = false;
  routes: any;
  constructor(
        private router: Router,
        private route: ActivatedRoute,
        private routerExtService: RouterExtService
  ) {}
  user: UserModel
  ngOnInit() {
//     let user = JSON.parse(localStorage.getItem('user'));
//     this.user = user;
    this.routes = childRoutes.filter(x => x.data.showInSidebar) ;
  }

  goToPath(item){
          this.router.navigate([item.path]);
  }

  getRouterLinkActive(path){
      let currentURL = this.routerExtService.getCurrentUrl();
      if(currentURL.includes(path)){
        return true;
      } else {
        return false;
      }
  }
}
