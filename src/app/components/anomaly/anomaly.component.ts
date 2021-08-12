import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { QueryParamsModel } from "../../models/query-param.model";
import { AnomalyService } from "../../services/anomaly.service";
import { AnomalyModel } from "../../models/anomaly.model";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import Swal from 'sweetalert2';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { AddAnomalyComponent } from '../add-anomaly/add-anomaly.component'
import { MarkerService } from 'src/app/services/marker.service';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { SettingService } from 'src/app/services/settings.service';

@Component({
    selector: 'app-anomaly',
    templateUrl: './anomaly.component.html',
    styleUrls: ['./anomaly.component.scss'],

})
export class AnomalyComponent implements OnInit, AfterViewInit, OnDestroy {

    // Auto-Refresh variable
    refreshRate: number;
    refreshRateSub: Subscription;
    timerCallBack: Subscription;

    displayedColumns = ['id', 'title', 'anomalyType', 'createdAt', 'reports', 'map', 'view', 'edit', 'delete'];
    dataSource = new MatTableDataSource<AnomalyModel>();
    searchText = ''
    pageSize = 100;

    currentPage = 0;

    totalSize = 100;

    title = $localize`List Of Anomaly`;

    gisUrl = environment.arcGisUrl;
    loading = true;
    mapid = "map";
    map: any
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    constructor(
        private anomalyService: AnomalyService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private router: Router,
        private markerService: MarkerService,
        private route: ActivatedRoute,
        private settings: SettingService
    ) { }

    ngOnInit() {

        this.getAllAnomalys();

        // Subscribe to any change of the refresh the list's refresh rate
        this.refreshRateSub = this.settings.listRefreshRateSubject.subscribe((rate) => {
            this.timerCallBack = interval(rate * 1000).subscribe(res => {
                this.getAllAnomalys();
            });
        });
        this.settings.emitListRefreshSubject();
    }


    ngOnDestroy() {
        this.timerCallBack.unsubscribe();
        this.refreshRateSub.unsubscribe();
    }
    onNotified(anomalyMap: any) {
        //debugger;
        this.map = anomalyMap;
        this.markerService.makeAnomalyMarkers(this.map)
    }

    applyFilter(filterValue: string) {
        //this.searchText = filterValue
        this.searchText = filterValue.trim().toLowerCase(); // Remove whitespace
        //filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
        // this.getAllAnomalys();
    }

    getAllAnomalys() {
        this.anomalyService.getAllAnomalys().subscribe((res) => {
            res['response'].forEach(element => {
                const dateComponent = moment.utc(element.createdAt).format('YYYY-MM-DD');
                const timeComponent = moment.utc(element.createdAt).local().format('HH:mm:ss');
                const createdAt = dateComponent + " " + timeComponent;
                element.createdAt = createdAt;
            });
            this.dataSource.data = res['response'] as AnomalyModel[];
            this.totalSize = res['totalCount'];
            this.loading = false;
        });
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
            title: $localize`Do You want to delete it?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: $localize`Yes`,
            cancelButtonText: $localize`No`
        }).then((result) => {
            if (result.value) {
                this.loading = true;
                this.anomalyService.deleteAnomaly(row.id).subscribe((res) => {
                    if (res) {
                        Swal.fire(
                            $localize`Deleted!`,
                            $localize`Anomaly Successfully Deleted`,
                            'success'
                        )
                        this.getAllAnomalys();
                    }
                })
            }
        })
    }

    editAnomaly(row) {
        const dialogRef = this.dialog.open(AddAnomalyComponent, { data: { anomaly: row, type: 'edit' }, width: '440px' });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.getAllAnomalys();
                let message = $localize`Anomaly Information Updated`;
                this._snackBar.open(message, 'OK', {
                    duration: 2000
                });
            }
        });
    }

    viewAnomaly(row) {
        const dialogRef = this.dialog.open(AddAnomalyComponent, { data: { anomaly: row, type: 'view' }, width: '440px' });

    }

    addAnomaly() {
        const dialogRef = this.dialog.open(AddAnomalyComponent, { width: '440px' });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.getAllAnomalys();
                let message = $localize`New Anomaly Successfully Added`;
                this._snackBar.open(message, 'OK', {
                    duration: 2000
                });
            }
        });

    }

    showMap(row) {
        // console.log(row.id)
        // console.log(this.gisUrl + "" + row.id);
        window.open(this.gisUrl + "" + row.id, "_blank")
    }

    goToReport(row) {
        this.router.navigate([row.id + '/' + "/report"], { relativeTo: this.route });
    }

    handlePage(e: any) {
        this.currentPage = e.pageIndex;
        this.pageSize = e.pageSize;
    }



}
