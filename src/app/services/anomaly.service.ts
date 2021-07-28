import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {AnomalyModel} from '../models/anomaly.model';
import {environment} from '../../environments/environment';
import {HttpUtilsService} from "./http-utils.service";
import {Router} from "@angular/router";
import {QueryParamsModel} from "../models/query-param.model";

const ANOMALY_URL = `${environment.pathToAPI}/api/v1/Anomaly`;

@Injectable()
export class AnomalyService {
    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService
    ) {}

    getAllAnomalys() {
    	console.log('anomalyService.getanomalys!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.get(ANOMALY_URL, { headers: headers });
    }

    getAnomalys(queryParams:QueryParamsModel) {
    	console.log('anomalyService.getanomalys!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.post(ANOMALY_URL+'/find-filtered',queryParams, { headers: headers });
    }

    deleteAnomaly(anomaly_id:number) {
    	console.log('anomalyService.deleteanomaly!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.delete(ANOMALY_URL+'/'+anomaly_id, { headers: headers });
    }

    editAnomaly(anomaly_id:number, anomaly:AnomalyModel) {
    	console.log('anomalyService.editanomaly!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.put(ANOMALY_URL+'/'+anomaly_id, anomaly,{ headers: headers });
    }

    createAnomaly(anomaly:AnomalyModel) {
    	console.log('anomalyService.createanomaly!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.post(ANOMALY_URL, anomaly,{ headers: headers });
    }

    getAnomaly(anomaly_Id:number)
    {
        console.log('anomalyService.findAnomaly!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.get(ANOMALY_URL+'/'+anomaly_Id, { headers: headers });
    }


}
