import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  sideNavOpened = false;
  sideNavMode: 'side' | 'over' = 'side';
  toolBarHeight = 64;
  IsHidden=true;
  url:string;
  private readonly mediaWatcher: Subscription;
  constructor(media: MediaObserver,private router: Router) {
    debugger;
    console.log("hiiii");
    this.url= this.router.url
    console.log(this.url);
    if(this.url=="/settings/display")
     this.IsHidden=false;
     else
     this.IsHidden=true;

    this.mediaWatcher = media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        if (this.sideNavOpened) {
          this.sideNavOpened = false;
        }
        this.sideNavMode = 'over';
      } else {
        this.sideNavOpened = true;
        this.sideNavMode = 'side';
      }
      if (change.mqAlias === 'xs') {
        this.toolBarHeight = 56;
      } else {
        this.toolBarHeight = 64;
      }
    });
  }
  ngOnInit() {;
   }

  ngOnDestroy(): void { 
    this.mediaWatcher.unsubscribe();
    
  }

}
