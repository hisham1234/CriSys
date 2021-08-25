import { AnomalyComponent } from './anomaly/anomaly.component';
import { ReportListComponent } from './report-list/report-list.component';
import { AddReportComponent } from './add-report/add-report.component';
import { MapComponent } from './map/map.component';
import { AuthGuard } from '../core/auth.guard';
import { GalleryScreenComponent } from './gallery-screen/gallery-screen.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { DisplaySettingsComponent } from './display-settings/display-settings.component';
import { UserListComponent } from './user-list/user-list.component';

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
  },{
    path: 'settings/display',
    component: DisplaySettingsComponent,
    data: {
      showInSidebar: true,
      text:"Display Settings",
      icon: 'dashboard',
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'settings/users',
    component: UserListComponent,
    data: {
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
      showInSidebar: false,
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
    path: 'anomaly/:aid/:rid/report-view',
    component: ReportViewComponent,
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
      showInSidebar: false,
    },
    canActivate: [AuthGuard],
  }
];
