import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpUtilsService} from "./http-utils.service";


@Injectable({
  providedIn: 'root'
})
export class MarkerService {
   capitals  = {
   
    "Location": [
      {
        
       
        "latitude":35.746895,
        "longtitude":139.605194
      
      },
      {
        
        
        "latitude":35.772665,
        "longtitude":139.675575
      }]
    };

  constructor( private http: HttpClient,
    private httpUtils: HttpUtilsService) { }

  makeCapitalMarkers(map: L.map): void {
   debugger;
    //this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of this.capitals.Location) {
        const lon = c.longtitude;
        const lat = c.latitude;
        const marker = L.marker([lat, lon]);

        marker.addTo(map);
      }
  // });
 }
}
