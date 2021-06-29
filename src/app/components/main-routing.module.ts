import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnomalyComponent } from './anomaly/anomaly.component';
import { ReportListComponent } from './report-list/report-list.component';
import { LayoutComponent } from '../admin/layout/layout.component';
import { childRoutes } from './child-routes';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
            ...childRoutes
    ]
  }
//   ,
//   {
//     path: 'anomaly/:id/event',
//     component: EventListComponent,
//   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
