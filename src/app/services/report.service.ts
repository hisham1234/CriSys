import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ReportModel} from '../models/report.model';
import {environment} from '../../environments/environment';
import {HttpUtilsService} from "./http-utils.service";
import {Router} from "@angular/router";
import {QueryParamsModel} from "../models/query-param.model";

const REPORT_URL = `${environment.pathToAPI}/api/v1/AnomalyReport`;
const ANOMALY_REPORT_URL = `${environment.pathToAPI}/api/v1/Anomaly`;

@Injectable()
export class ReportService {
    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private router: Router
    ) {}

    getAllReports() {
    	console.log('ReportService.getAllReports!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.get(REPORT_URL, { headers: headers });
    }

    getReports(queryParams:QueryParamsModel) {
    	console.log('ReportService.getReports!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.post(REPORT_URL+'/find-filtered',queryParams, { headers: headers });
    }

    getAnomalyReport(anomaly_Id:number) {
    	console.log('ReportService.getAnomalyReport!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.get(REPORT_URL + "/Anomaly/" + anomaly_Id , { headers: headers });
    }

    getReport(report_Id:number) {
    	console.log('ReportService.getReport!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.get(REPORT_URL + "/" + report_Id, { headers: headers });
    }

    deleteReport(report_id:number) {
    	console.log('ReportService.deleteReport!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.delete(REPORT_URL+'/'+report_id, { headers: headers });
    }

    editReport(report_id:number, report:ReportModel) {
    	console.log('ReportService.editReport!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.put(REPORT_URL+'/'+report_id, report,{ headers: headers });
    }

    createReport(report:ReportModel) {
    	console.log('ReportService.createReport!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.post(REPORT_URL, report,{ headers: headers });
    }

    sentDataToGIS(gisData : any) {
      let GIS_URL = "http://anomalygis-db-api.azurewebsites.net/api/sentgis";
    	console.log('ReportService.sendDataToGIS!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.post(GIS_URL, gisData,{ headers: headers });
    }


}
