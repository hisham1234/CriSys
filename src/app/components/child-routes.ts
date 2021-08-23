import { AnomalyComponent } from './anomaly/anomaly.component';
import { ReportListComponent } from './report-list/report-list.component';
import { AddReportComponent } from './add-report/add-report.component';
import { MapComponent } from './map/map.component';
import { AuthGuard } from '../core/auth.guard';
import { Role } from '../models/role';
import { GalleryScreenComponent } from './gallery-screen/gallery-screen.component';

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
    canActivate: [AuthGuard],
  },
  {
    path: 'anomaly',
    pathMatch: 'full',
    component: AnomalyComponent,
    data: {
      icon: 'dashboard',
      text: $localize`Anomaly`,
      showInSidebar: true,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'map',
    component: MapComponent,
    data: {
      icon: 'dashboard',
      text: $localize`Anomaly`,
      showInSidebar: false,
      //roles: [Role.User1, Role.Admin],
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'anomaly/:aid/report',
    component: ReportListComponent,
    data: {
      showInSidebar: false,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'anomaly/:aid/report/:rid',
    component: AddReportComponent,
    data: {
      showInSidebar: false,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'gallery',
    pathMatch: 'full',
    component: GalleryScreenComponent,
    data: {
      icon: 'dashboard',
      text: $localize`Gallery Screen`,
      showInSidebar: true,
    },
    canActivate: [AuthGuard],
  }
];
