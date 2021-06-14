import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxFileDropModule } from 'ngx-file-drop';



import { MainRoutingModule } from './main-routing.module';
import { AnomalyComponent } from './anomaly/anomaly.component';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
// import { CoreModule } from '../core/core.module';
// import { SharedModule } from '../shared/shared.module';

import { LayoutComponent } from '../admin/layout/layout.component';
import { TopNavComponent } from '../admin/layout/top-nav/top-nav.component';
import { SideNavComponent } from '../admin/layout/side-nav/side-nav.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import { UserService } from '../services/user.service';
import { AnomalyService } from '../services/anomaly.service';
import { HttpUtilsService } from '../services/http-utils.service';
import { ReportService } from '../services/report.service';
import { ImageService } from '../services/image.service';
import { RouterExtService } from '../services/router-ext.service';

import { AddAnomalyComponent } from './add-anomaly/add-anomaly.component';
import { ReportListComponent } from './report-list/report-list.component';
import { AddReportComponent } from './add-report/add-report.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
import { MapComponent } from './map/map.component';
import { MarkerService } from '../services/marker.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  imports: [
//   CoreModule,
//     SharedModule,
    CommonModule,
        MainRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
        MatPaginatorModule,
        MatTableModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        PerfectScrollbarModule,
        CarouselModule,
        NgxFileDropModule
  ],
   providers:[
        MatSnackBar,
        CommonModule,
        MainRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
        MatPaginatorModule,
        MatTableModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        UserService,
        AnomalyService,
        HttpUtilsService,
        ReportService,
        ImageService,
        RouterExtService,
        MarkerService,
        {
          provide: PERFECT_SCROLLBAR_CONFIG,
          useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    exports: [
        CommonModule,
        MainRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatListModule,
        MatPaginatorModule,
        MatTableModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule

    ],
  declarations: [
          LayoutComponent,
          TopNavComponent,
          SideNavComponent,
          AnomalyComponent,
          AddAnomalyComponent,
          ReportListComponent,
          AddReportComponent,
          ImageDialogComponent,
          ImageCarouselComponent,
          MapComponent
  ],
  entryComponents: [
    AddAnomalyComponent,
    ImageDialogComponent,
    ImageCarouselComponent
  ],
})
export class MainModule {}
