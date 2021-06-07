import { AnomalyComponent } from './anomaly/anomaly.component';
import { ReportListComponent } from './report-list/report-list.component';
import { AddReportComponent } from './add-report/add-report.component';

export const childRoutes = [
  { path: '',
      redirectTo: '/anomaly',
      pathMatch: 'full',
         data: {
            icon: 'dashboard',
            text: 'タイムライ',
            showInSidebar: false
        }
     },
  {
    path: 'anomaly',
    component: AnomalyComponent,
    data: {
        icon: 'dashboard',
        text: '異常',
        showInSidebar: true
    },
      },
  {
    path: 'anomaly/:aid/report',
    component: ReportListComponent,
    data: {
        showInSidebar: false
    }
  },
  {
    path: 'anomaly/:aid/report/:rid',
    component: AddReportComponent,
    data: {
        showInSidebar: false
    }
  }
];
