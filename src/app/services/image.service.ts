import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ImageModel} from '../models/image.model';
import {environment} from '../../environments/environment';
import {HttpUtilsService} from "./http-utils.service";
import {Router} from "@angular/router";
import {QueryParamsModel} from "../models/query-param.model";

const IMAGE_URL = `${environment.pathToAPI}/api/v1/Image`;
const ANOMALY_REPORT_IMAGE_URL = `${environment.pathToAPI}/api/v1/AnomalyReportImage`;

@Injectable()
export class ImageService {
    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private router: Router
    ) {}

    getAllImages() {
    	console.log('ImageService.getAllImages!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.get(IMAGE_URL, { headers: headers });
    }

    getTimelineImage(image_Id:number) {
    	console.log('ImageService.getTimelineImage!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.get(IMAGE_URL + "/" + image_Id + "/image", { headers: headers });
    }

    getImage(image_Id:number) {
    	console.log('ImageService.getImage!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.get(IMAGE_URL + "/" + image_Id, { headers: headers });
    }

    deleteImage(image_id:number) {
    	console.log('ImageService.deleteImage!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.delete(IMAGE_URL+'/'+image_id, { headers: headers });
    }

    editImage(image_id:number, image:ImageModel) {
    	console.log('ImageService.editImage!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.put(IMAGE_URL+'/'+image_id, image,{ headers: headers });
    }

    createImage(imageFormData:FormData) {
    	console.log('ImageService.createImage!');
        //debugger;
        const headers = this.httpUtils.getHTTPHeadersFormData();
       //return this.http.post(IMAGE_URL, imageFormData,{headers: headers});
         return this.http.post(IMAGE_URL, imageFormData);

    }

    createAnomalyReportImage(imageFormData: FormData, anomalyReportId: number) {
    	console.log('ImageService.createAnomalyReportImage!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.createImage(imageFormData).subscribe( (res) => {
            let returnedImageData = res["response"];
            if(returnedImageData["id"]){
                 return this.http.post(`${ANOMALY_REPORT_IMAGE_URL}/${anomalyReportId}/image-id/${returnedImageData["id"]}`,{ headers: headers }).subscribe((res) => {
                     console.log(res);
                 });
            }
            return null;
        });
        
    }

    createOrUpdateAnomalyReportImageWithImageIds(data: any) {
    	console.log('ImageService.createAnomalyReportImage!');
        const headers = this.httpUtils.getHTTPHeaders();
        return this.http.post(ANOMALY_REPORT_IMAGE_URL + '/with-image-ids', data,{ headers: headers });
    }


}
