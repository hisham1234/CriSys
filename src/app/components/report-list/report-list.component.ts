import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { QueryParamsModel } from "../../models/query-param.model";
import { ReportService } from "../../services/report.service";
import { ReportModel } from "../../models/report.model";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
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
import { MatTableDataSource } from '@angular/material/table';
import { interval } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
export class ReportListComponent implements OnInit, AfterViewInit, OnDestroy {
  // Auto-Refresh Variable
  refreshRate: number;
  userSub: Subscription;
  timerCallBack: Subscription;


  displayedColumns = ['id', 'image', 'title', 'road', 'comment','createdAt', 'kp', 'latitude', 'longitude', 'edit', 'delete'];
  dataSource = new MatTableDataSource<ReportModel>();

  searchText = ''
  pageSize = 100;
  anomalyData: any;
  mapid = "maps"
  reportCordinates: any;
  currentPage = 0;
  gisUrl = environment.arcGisUrl;
  totalSize = 100;
  private sub: any;
  anomalyId: number;
  anomalyName: string;
  title = $localize`List Of Reports`;
  titleAnomaly = $localize`List Of Anomaly`
  btnAdd = $localize`Add Report`;
  btnArcGis = $localize`View in ArcGIS`;
  loading = true;
  offset: number;
  subscription: Subscription;
  MILLI_IN_SEC = 1000;
  clickEventsubscription: Subscription;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private reportService: ReportService,
    private anomalyService: AnomalyService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private markerService: MarkerService,
    private eventEmitterService: EventEmitterService,
    private authentication: AuthenticationService
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
    // Subscribe to any list's refresh rate modification
    this.userSub = this.authentication.userSubject.subscribe((user) => {
      this.timerCallBack = interval(user.refreshRate * this.MILLI_IN_SEC).subscribe(res => {
        this.getAnomalyReport();
      });
    });
    if(this.authentication.user !== undefined) {
        this.authentication.emitUser();
    }
  }


  getAnomalyReportData() {
    this.sub = this.route.params.subscribe((params) => {
      this.anomalyId = +params['aid']; // (+) converts string 'id' to a number

      this.getAnomalyReport();

    });
  }

  getAnomalyName() {
    this.anomalyService.getAnomaly(this.anomalyId).subscribe((res) => {
      //debugger;     
      this.anomalyName = res['response'].title;
      
    })
  }

  private map;

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.timerCallBack.unsubscribe();
    this.userSub.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public customSort = (event) => {
    // console.log(event);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
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

  getAnomalyReport() {
    this.reportService.getAnomalyReport(this.anomalyId).subscribe(res => {

      res['response'].forEach(element => {
        
        const dateComponent = moment.utc(element.createdAt).format('YYYY-MM-DD');
        const timeComponent = moment.utc(element.createdAt).local().format('HH:mm:ss');
        const createdAt = dateComponent + " " + timeComponent;
        element.createdAt = createdAt;
        // if(!element.comment){
        //   element.comment ="test commenihdfigbrigb";
        //  }
      });

      this.totalSize = res['totalCount'];
      this.dataSource.data = res['response'] as ReportModel[];
      this.totalSize = res['totalCount'];
      this.loading = false;
      this.reportCordinates = this.dataSource.data;    
      this.markerService.makeCapitalMarkers(this.map,this.dataSource.data)

    })
  }
  onNotified(reportMap: any) {

    this.map = reportMap;
  }

  getAllReports() {

    this.loading = true;
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      //            this.sort.direction,
      'desc',
      //             this.sort.active,
      'createdAt',
      this.currentPage,
      this.pageSize
    );
    this.reportService.getReports(queryParams).subscribe((res) => {
      this.loading = false;
      this.dataSource.data = res['response'] as ReportModel[];
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

  deleteReport(row) {
    Swal.fire({
      title: $localize`Do You Want To Delete It?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: $localize`Yes`,
      cancelButtonText: $localize`No`
    }).then((result) => {
      this.loading = true;
      if (result.value) {
        this.reportService.deleteReport(row.id).subscribe((res) => {
          if (res) {
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

  addReport() {

    this.router.navigate(['add'], { relativeTo: this.route });

  }

  editReport(rowId) {
    this.router.navigate([rowId], { relativeTo: this.route });
  }

  goToReportView(row) {   
    this.router.navigate([`anomaly/${this.anomalyId}/${row.id}/report-view`]);
  }


  addToGIS(row) {
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
      if (res) {
        Swal.fire(
          '追加!',
          'ポイントがGISに追加されました。',
          'success'
        )
        this.loading = false;
      }
    })


  }

  openImageCarousel(row) {
    if (row.anomalyReportImage.length > 0) {
      const dialogRef = this.dialog.open(ImageCarouselComponent, { data: row.anomalyReportImage.map(i => i.image), width: '700px' });
      dialogRef.afterClosed().subscribe(res => {
      });
    }
  }


  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    //         this.getAllReports();
  }

  redirectToArcGis() {
    window.open(this.gisUrl + "" + this.anomalyId, "_blank")

  }

}
