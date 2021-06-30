import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpUtilsService} from "./http-utils.service";
import { environment } from 'src/environments/environment';

const REPORT_URL = `${environment.pathToAPI}/api/v1/AnomalyReport`;

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
    
   allReportData:any;
   
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
    this.http.get(REPORT_URL, { headers: headers }).subscribe(res => {
        this.allReportData=  res['response'];
       console.log(this.allReportData);
       let idCount=0;
       let anomalyId=0;
       let counter=0;
       let sumOfLat=0;
       let sumOfLon=0;
       debugger;
       for(const c of this.allReportData)
       {
         counter++;
        
        

         if(anomalyId==0)
         {
             idCount=idCount+1;
             anomalyId=c.anomalyId;
             sumOfLat=sumOfLat+parseFloat(c.latitude);
             sumOfLon=sumOfLon+parseFloat(c.longitude);
            
         }
         else if(anomalyId==c.anomalyId)
         {
          idCount=idCount+1;
          anomalyId=c.anomalyId;
          
          if(counter==this.allReportData.length)
          {
           
            sumOfLat=sumOfLat+parseFloat(c.latitude);
            sumOfLon=sumOfLon+parseFloat(c.longitude);
            let lat=sumOfLat/idCount;
            let lon=sumOfLon/idCount;
            const marker = L.marker([lat, lon]);
            console.log("aid :"+anomalyId +" lat:"+lat +" lon: "+lon);
            marker.addTo(map);
           
            continue;
          }
          sumOfLat=sumOfLat+parseFloat(c.latitude);
          sumOfLon=sumOfLon+parseFloat(c.longitude);
        
         }
         else
         {
          
           let lat=sumOfLat/idCount;
           let lon=sumOfLon/idCount;
           const marker = L.marker([lat, lon]);
           console.log("aid :"+anomalyId +" lat:"+lat +" lon: "+lon);
           marker.addTo(map);
           idCount=1;
           anomalyId=c.anomalyId;
           sumOfLon=parseFloat(c.longitude);
           sumOfLat=parseFloat(c.latitude);
         }
         
             
       }
           
  })
 

}
}
