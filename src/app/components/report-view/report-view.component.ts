import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AnomalyService } from 'src/app/services/anomaly.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { MarkerService } from 'src/app/services/marker.service';
import * as L from 'leaflet';

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

interface ReportData {
  id: any;
  anomalyId: any;
  createdAt: any;
  title: any;
  kp: any;
  latitude: any;
  longitude: any;
  comment: any;
  createdBy: any;
  direction: any;
  road: any;
  anomalyReportImage: [];
}
@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss'],
})
export class ReportViewComponent implements OnInit {
  reportId: number;
  anomalyId: number;
  private sub: any;
  reportData: ReportData;

  lblReportId = $localize`Report ID`;
  lblTitle = $localize`Title`;
  lblAnomalyId = $localize`Anomaly ID`;
  lblRoad = $localize`Road`;
  lblLatitude = $localize`Latitude`;
  lblLongitude = $localize`Longitude`;
  lblCreatedAt = $localize`Created At`;
  lblComment = $localize`Comment`;
  lblImages = $localize`Images`;
  lblCreatedBy = $localize`Created By`;
  lblDirection = $localize`Direction`;

  scrHeight: any;
  scrWidth: any;
  selectedLibraryImages = [];
  anomalyName: any;

  mapid = "mapr";
  coordination:any ={}; 
  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private anomalyService: AnomalyService,
    private markerService: MarkerService,
  ) {
    this.reportData = {
      id: '',
      anomalyId: '',
      createdAt: '',
      title: '',
      kp: '',
      latitude: '',
      longitude: '',
      comment: '',
      createdBy: '',
      direction: '',
      road: '',
      anomalyReportImage: [],
    };
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.reportId = +params['rid']; // (+) converts string 'id' to a number
      this.anomalyId = +params['aid'];
      
      this.coordination.lat = +params['rlat'];
      this.coordination.lon =  +params['rlon'];
      
      this.getAnomalyReport();
      this.getAnomalyName();
    });
  }

  getAnomalyReport() {
    this.reportService.getReport(this.reportId).subscribe((res) => {
      const reportResponse = res['response'];

      if (reportResponse.anomalyReportImage) {
        this.selectedLibraryImages = reportResponse.anomalyReportImage.map(
          (i) => i.image
        );
      }
      const dateComponent = moment
        .utc(reportResponse.createdAt)
        .format('YYYY-MM-DD');
      const timeComponent = moment
        .utc(reportResponse.createdAt)
        .local()
        .format('HH:mm:ss');

      const createdAt = dateComponent + ' ' + timeComponent;
      reportResponse.createdAt = createdAt;
      this.reportData = reportResponse;     
      this.markerService.makeCapitalMarkers(this.map,[this.reportData]);
    });
  }
  getAnomalyName() {
    this.anomalyService.getAnomaly(this.anomalyId).subscribe((res) => {
      this.anomalyName = res['response'].title;
    });
  }

  goToReport() {
    this.router.navigate(['anomaly/' + this.anomalyId + '/report']);
  }

  editReport() {
    this.router.navigate([
      'anomaly/' + this.anomalyId + '/report/' + this.reportId,
    ]);
  }
  deleteReport() {
    Swal.fire({
      title: $localize`Do You Want To Delete It?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: $localize`Yes`,
      cancelButtonText: $localize`No`,
    }).then((result) => {
      // this.loading = true;
      if (result.value) {
        this.reportService.deleteReport(this.reportId).subscribe((res) => {
          if (res) {
            // this.getAnomalyReportData();
            Swal.fire(
              $localize`Deleted!`,
              $localize`Report Successfully Deleted.`,
              'success'
            );
            this.goToReport();
          }
        });
      }
    });
  }

  showImage(selectedLibraryImage) {
    const dialogRef = this.dialog.open(ImageCarouselComponent, {
      data: [selectedLibraryImage],
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((res) => {});
  }
  openImageDialog() {
    let width = this.scrWidth - this.scrWidth * 0.2;
    let height = this.scrHeight - this.scrHeight * 0.2;

    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: width.toString() + 'px',
      height: height.toString() + 'px',
      data: this.selectedLibraryImages,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.selectedLibraryImages = res['data'];
        let message = '新しいイベントが追加されました';
      }
    });
  }
  private map;
  onNotified(reportMap: any) {
    this.map = reportMap;
  }
}
