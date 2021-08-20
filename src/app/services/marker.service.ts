import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpUtilsService} from "./http-utils.service";
import { environment } from 'src/environments/environment';

const ANOMALY_URL = `${environment.pathToAPI}/api/v1/Anomaly`;

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
    
   allAnomalyData:any;
   
   constructor( private http: HttpClient,
    private httpUtils: HttpUtilsService) { }

  makeCapitalMarkers(map: L.map,reportData:any) {
  
  
       for (const c of reportData) {
        const lon = c.longitude;
        const lat = c.latitude;
        const marker = L.marker([lat, lon]);
       
        marker.addTo(map);
      } 
  
 }
  makeAnomalyMarkers(map: L.map) {
    const headers = this.httpUtils.getHTTPHeaders();
    this.http.get(ANOMALY_URL, { headers: headers }).subscribe(res => {
        this.allAnomalyData=  res['response'];
       
       for(const c of this.allAnomalyData)
       {
         if(c.latitude !=null && c.longitude!=null)
         {
          let lat=c.latitude;
          let lon=c.longitude;
          const marker = L.marker([lat, lon]);
            
             marker.addTo(map);
         }
       

       }

           
  })
 

}
}
