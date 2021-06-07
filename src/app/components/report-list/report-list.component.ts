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

    currentPage = 0;

    totalSize = 100;
    private sub: any;
    anomalyId: number;

    title = "レポート一覧";

    loading = true;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    constructor(
        private  reportService: ReportService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
           this.anomalyId = +params['aid']; // (+) converts string 'id' to a number
           this.getAnomalyReport();
            //   this.getAllReports();
        });

    }

    ngOnDestroy() {
    this.sub.unsubscribe();
  }

    ngAfterViewInit() {
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
            this.dataSource = res['response'];
            this.totalSize = res['totalCount'];
            this.loading = false;            
        })
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
            title: '削除しますか？',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'はい',
            cancelButtonText: 'いいえ'
        }).then((result) => {
        this.loading = true;
            if (result.value) {
                this.reportService.deleteReport(row.id).subscribe((res)=>{
                    if (res){
                        Swal.fire(
                            '削除!',
                            'イベントが削除されました.',
                            'success'
                        )
                        this.getAllReports();
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

}
