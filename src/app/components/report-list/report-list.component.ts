import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {QueryParamsModel} from "../../models/query-param.model";
import {ReportService} from "../../services/report.service";
import {ReportModel} from "../../models/report.model";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from 'sweetalert2';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AddReportComponent } from '../add-report/add-report.component';
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import * as L from 'leaflet';
import { MarkerService } from '../../services/marker.service';
import { $ } from 'protractor';
import { environment } from 'src/environments/environment';
import { AnomalyService } from 'src/app/services/anomaly.service';
import { Subscription } from 'rxjs';
import { EventEmitterService } from 'src/app/services/event-emitter.service';
import * as moment from 'moment';
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
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {
displayedColumns = [ 'id', 'image', 'title', 'road', 'createdAt','kp','latitude','longitude', 'edit', 'delete'];
    dataSource: ReportModel[] = []
    searchText=''
    pageSize = 100;
    anomalyData:any;
    mapid="maps"
    reportCordinates:any;
    currentPage = 0;
    gisUrl=environment.arcGisUrl;
    totalSize = 100;
    private sub: any;
    anomalyId: number;
    anomalyName: string;
    title = $localize `List Of Reports`;
    titleAnomaly=$localize`List Of Anomaly`
    btnAdd=$localize`Add Report`;
    btnArcGis=$localize`View in ArcGIS`;
    loading = true;
    subscription: Subscription;
    clickEventsubscription: Subscription;
    
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
  offset: number;
    constructor(
        private  reportService: ReportService,
        private anomalyService:AnomalyService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute,
        private markerService: MarkerService,
        private eventEmitterService: EventEmitterService
    ) {
      this.offset = new Date().getTimezoneOffset();
      this.clickEventsubscription = this.eventEmitterService
      .getClickEvent()
      .subscribe(() => {
        this.getAnomalyReportData();
      });
    }

    ngOnInit() {
      
       
       this.getAnomalyReportData();    
       this.getAnomalyName(); 
    }
    getAnomalyReportData() {    
      this.sub = this.route.params.subscribe((params) => {
        this.anomalyId = +params['aid']; // (+) converts string 'id' to a number
          
        this.getAnomalyReport();
       
      });
    }

    getAnomalyName(){
      this.anomalyService.getAnomaly(this.anomalyId).subscribe((res)=>{
       // debugger;
        console.log(res);
        this.anomalyName=res['response'].title;
        console.log(this.anomalyName);
      })
    }

    private map;
  
    

    

    ngOnDestroy() {
    this.sub.unsubscribe();
  }

  

    applyFilter(filterValue: string) {
        this.searchText = filterValue
        this.getAllReports();
    }

    //     getAllReports(){
    //     this.reportService.getAllReports().subscribe((res)=>{
    //         this.dataSource = res['response'];
    //         this.totalSize = res['totalCount'];
    //     });
    // }
    
    getAnomalyReport(){
       


      
        this.reportService.getAnomalyReport(this.anomalyId).subscribe(res => {
          
          res['response'].forEach(element => {               
            const dateComponent = moment.utc(element.createdAt).format('YYYY-MM-DD');
            const timeComponent = moment.utc(element.createdAt).local().format('HH:mm:ss');
            const createdAt =dateComponent+" "+timeComponent;
            element.createdAt = createdAt;
          });        
            this.dataSource = res['response'];
            this.totalSize = res['totalCount'];
            this.loading = false;
            this.reportCordinates=this.dataSource;
          
            this.markerService.makeCapitalMarkers(this.map,this.dataSource)
                 
        })
    }
    onNotified(reportMap:any)
    {
      
      this.map=reportMap;
    }

    getAllReports(){
        
    this.loading = true;
        const queryParams = new QueryParamsModel(
            this.filterConfiguration(),
//             this.sort.direction,
            'desc',
//             this.sort.active,
            'createdAt',
            this.currentPage,
            this.pageSize
        );
        this.reportService.getReports(queryParams).subscribe((res)=>{
            this.loading = false;
            this.dataSource = res['response'];
            this.totalSize = res['totalCount'];
        });
    }

    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchText;
        filter.searchText = searchText;
        filter.anomalyId = this.anomalyId;
        return filter;
    }

    deleteReport(row){
        Swal.fire({
            title: $localize`Do You Want To Delete It?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: $localize`Yes`,
            cancelButtonText: $localize`No`
        }).then((result) => {
        this.loading = true;
            if (result.value) {
                this.reportService.deleteReport(row.id).subscribe((res)=>{
                    if (res){
                      this.getAnomalyReportData();
                        Swal.fire(
                            $localize`Deleted!`,
                            $localize`Report Successfully Deleted.`,
                            'success'
                        )
                      
                    }
                })
            }
        })
    }

    addReport(){

          this.router.navigate(['add'], {relativeTo: this.route});

    }

    editReport(rowId){
          this.router.navigate([rowId], {relativeTo: this.route});
    }

    goToReport(row){

    }

    addToGIS(row){
    this.loading = true;
      let gis_data = {
            "create_date": row.dateCreate,
            "road": row.road,
            "KP": row.kp,
            "IDO": row.ido,
            "KEIDO": row.keido,
            "pictureName": row.reportImages ? row.reportImages[0].image.name : null
        }

        this.reportService.sentDataToGIS(gis_data).subscribe((res) => {
          if(res){
            Swal.fire(
                    '追加!',
                    'ポイントがGISに追加されました。',
                    'success'
                )
            this.loading = false;
          }
        })


    }

    openImageCarousel(row){        
      if(row.anomelyReportImage.length > 0){
        const dialogRef = this.dialog.open(ImageCarouselComponent, {data: row.anomelyReportImage.map(i => i.image), width: '700px'});
          dialogRef.afterClosed().subscribe(res => {
          });
      }
    }


    handlePage(e: any) {
        this.currentPage = e.pageIndex;
        this.pageSize = e.pageSize;
//         this.getAllReports();
    }

    redirectToArcGis()
    {
      window.open(this.gisUrl+""+this.anomalyId,"_blank")  
     
    }

}
