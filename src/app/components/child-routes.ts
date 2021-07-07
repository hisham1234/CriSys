import { AnomalyComponent } from './anomaly/anomaly.component';
import { ReportListComponent } from './report-list/report-list.component';
import { AddReportComponent } from './add-report/add-report.component';
import { MapComponent } from './map/map.component';
import { AuthGuard } from '../core/auth.guard';
import { Role } from '../models/role';

export const childRoutes = [
  {
    path: '',
    redirectTo: '/anomaly',
    pathMatch: 'full',
    data: {
      icon: 'dashboard',
      text: 'タイムライ',
      showInSidebar: false,
    },
    //canActivate: [AuthGuard],   //un comment here
  },
  {
    path: 'anomaly',
    component: AnomalyComponent,
    data: {
      icon: 'dashboard',
      text: '異常',
      showInSidebar: true,
    },
    //canActivate: [AuthGuard],   // <<<  un comment here
  },
  {
    path: 'map',
    component: MapComponent,
    data: {
      icon: 'dashboard',
      text: '異常',
      showInSidebar: false,
       //roles: [Role.User1, Role.Admin],   // <<<  un comment here
    },
    //canActivate: [AuthGuard],   // <<<  un comment here
  },
  {
    path: 'anomaly/:aid/report',
    component: ReportListComponent,
    data: {
      showInSidebar: false,
    },
    // canActivate: [AuthGuard],   // <<<  un comment here
  },
  {
    path: 'anomaly/:aid/report/:rid',
    component: AddReportComponent,
    data: {
      showInSidebar: false,
    },
    //canActivate: [AuthGuard],   // <<<  un comment here
  },
];
