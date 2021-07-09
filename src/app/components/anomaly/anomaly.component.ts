import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { QueryParamsModel } from "../../models/query-param.model";
import { AnomalyService } from "../../services/anomaly.service";
import { AnomalyModel } from "../../models/anomaly.model";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import Swal from 'sweetalert2';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';


import { AddAnomalyComponent } from '../add-anomaly/add-anomaly.component'
import { TRANSLOCO_CONFIG, TRANSLOCO_LOADER ,translocoConfig, TRANSLOCO_SCOPE} from '@ngneat/transloco';

@Component({
    selector: 'app-anomaly',
    templateUrl: './anomaly.component.html',
    styleUrls: ['./anomaly.component.scss'],
    
})
export class AnomalyComponent implements OnInit {

    displayedColumns = ['id', 'title', 'anomalyType', 'createdAt',  'reports', 'view', 'edit', 'delete'];
    dataSource = []
    searchText = ''
    pageSize = 100;

    currentPage = 0;

    totalSize = 100;

    title = $localize `List Of Anomaly`;


    loading = true;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    constructor(
        private anomalyService: AnomalyService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.getAllAnomalys();
    }

    ngAfterViewInit() {
    }

    applyFilter(filterValue: string) {
        this.searchText = filterValue
        // this.getAllAnomalys();
    }

    getAllAnomalys() {
        this.anomalyService.getAllAnomalys().subscribe((res) => {
            this.dataSource = res['response'];
            this.totalSize = res['totalCount'];
            this.loading = false;
        });
    }

    //     getAllAnomalys(){
    //       this.loading = true;
    //         const queryParams = new QueryParamsModel(
    //             this.filterConfiguration(),
    // //             this.sort.direction,
    //             'desc',
    // //             this.sort.active,
    //             'createdAt',
    //             this.currentPage,
    //             this.pageSize
    //         );
    //         this.anomalyService.getAnomalys(queryParams).subscribe((res)=>{
    //             this.loading = false;
    //             this.dataSource = res['response'];
    //             this.totalSize = res['totalCount'];
    //         });
    //     }

    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchText;
        filter.searchText = searchText;
        return filter;
    }

    deleteAnomaly(row) {
        Swal.fire({
            title: $localize `Do You want to delete it?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: $localize `Yes`,
            cancelButtonText: $localize `No`
        }).then((result) => {
            if (result.value) {
                this.loading = true;
                this.anomalyService.deleteAnomaly(row.id).subscribe((res) => {
                    if (res) {
                        Swal.fire(
                            $localize `Deleted!`,
                            $localize `Anomaly Successfully Deleted`,
                            'success'
                        )
                        this.getAllAnomalys();
                    }
                })
            }
        })
    }

    editAnomaly(row) {
        const dialogRef = this.dialog.open(AddAnomalyComponent, { data: {anomaly:row, type: 'edit'},  width: '440px' });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.getAllAnomalys();
                let message = $localize `Anomaly Information Updated`;
                this._snackBar.open(message, 'OK', {
                    duration: 2000
                });
            }
        });
    }

    viewAnomaly(row) {
        const dialogRef = this.dialog.open(AddAnomalyComponent, { data: {anomaly:row, type: 'view'}, width: '440px' });
       
    }

    addAnomaly() {
        const dialogRef = this.dialog.open(AddAnomalyComponent, { width: '440px' });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.getAllAnomalys();
                let message = $localize `New Anomaly Successfully Added`;
                this._snackBar.open(message, 'OK', {
                    duration: 2000
                });
            }
        });

    }

   /*  showMap(row){
        console.log(row);        
    } */

    goToReport(row) {
        this.router.navigate([row.id + "/report"], { relativeTo: this.route });
    }

    handlePage(e: any) {
        this.currentPage = e.pageIndex;
        this.pageSize = e.pageSize;
    }



}
