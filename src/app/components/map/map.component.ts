import { Component, Input, OnInit,EventEmitter, Output } from '@angular/core';
//import { EventEmitter } from 'events';
import * as L from 'leaflet';
import { MarkerService } from '../../services/marker.service';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map=null;
   @Input() id;
   
   @Output() notify:EventEmitter<string>=new EventEmitter<string>();

  private initMap(): void {
    this.map=null;
    this.map = L.map(this.id, {
      center: [ 35.7083, 139.6948 ],
     //center: [ 39.8282, -98.5795 ],
      zoom: 3
    });
    

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 7,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    this.notify.emit(this.map);
  }

  constructor(private markerService: MarkerService) { }

  ngOnInit(): void {
   
  }

  ngAfterViewInit() {  
    this.initMap();
    
  
  }

}
