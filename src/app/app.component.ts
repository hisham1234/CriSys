import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){
    this.matIconRegistry.addSvgIcon(
      `earthquake`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/earthquake.svg")
    );
    this.matIconRegistry.addSvgIcon(
        `accident`,
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/accident.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `audit`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/audit.svg")
    );
    this.matIconRegistry.addSvgIcon(
        `rain`,
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/rain.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `nuclear`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/nuclear.svg")
    );
    this.matIconRegistry.addSvgIcon(
        `wind`,
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/wind.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `volcanic`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/volcanic.svg")
    );
    this.matIconRegistry.addSvgIcon(
        `terrorism`,
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/terrorism.svg")
    );
    this.matIconRegistry.addSvgIcon(
        `snowfall`,
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/snowfall.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `others`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/others.svg")
    );
    this.matIconRegistry.addSvgIcon(
        `disasters`,
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/images/icons/disasters.svg")
    );
   
  }
}
