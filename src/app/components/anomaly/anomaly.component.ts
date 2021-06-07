import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {QueryParamsModel} from "../../models/query-param.model";
import {AnomalyService} from "../../services/anomaly.service";
import {AnomalyModel} from "../../models/anomaly.model";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from 'sweetalert2';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';


import { AddAnomalyComponent } from '../add-anomaly/add-anomaly.component'
@Component({
  selector: 'app-anomaly',
  templateUrl: './anomaly.component.html',
  styleUrls: ['./anomaly.component.scss']
})
export class AnomalyComponent implements OnInit {

    displayedColumns = ['id', 'title', 'anomalyType', 'createdAt', 'event', 'edit', 'delete'];
    dataSource = []
    searchText=''
    pageSize = 100;

    currentPage = 0;

    totalSize = 100;

    title = "異常";


    loading = true;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    constructor(
        private  anomalyService: AnomalyService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {

        this.getAllAnomalys();
    }

    ngAfterViewInit() {
    }

    applyFilter(filterValue: string) {
        this.searchText = filterValue
        // this.getAllAnomalys();
    }

        getAllAnomalys(){
        this.anomalyService.getAllAnomalys().subscribe((res)=>{            
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

    deleteAnomaly(row){
        Swal.fire({
            title: '削除しますか？',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'はい',
            cancelButtonText: 'いいえ'
        }).then((result) => {
            if (result.value) {
            this.loading = true;
                this.anomalyService.deleteAnomaly(row.id).subscribe((res)=>{
                    if (res){
                        Swal.fire(
                            '削除!',
                            'タイムラインが削除されました。.',
                            'success'
                        )
                        this.getAllAnomalys();
                    }
                })
            }
        })
    }

    editAnomaly(row){
        const dialogRef = this.dialog.open(AddAnomalyComponent, {data: row, width: '440px'});
        dialogRef.afterClosed().subscribe(res => {
            if (res){
                this.getAllAnomalys();
                let message = "編集されたタイムライン";
                this._snackBar.open(message, 'OK', {
                    duration: 2000
                });
            }
        });

    }

    addAnomaly(){
        const dialogRef = this.dialog.open(AddAnomalyComponent, {width: '440px'});
        dialogRef.afterClosed().subscribe(res => {
            if (res){
                this.getAllAnomalys();
                let message = "新しいタイムラインが追加されました";
                this._snackBar.open(message, 'OK', {
                    duration: 2000
                });
            }
        });

    }

    goToReport(row){
        this.router.navigate([row.id + "/report"], {relativeTo: this.route});
    }

    handlePage(e: any) {
        this.currentPage = e.pageIndex;
        this.pageSize = e.pageSize;
    }



}
