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
}
