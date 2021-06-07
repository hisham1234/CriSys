import {Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class HttpUtilsService {

	getHTTPHeaders(): HttpHeaders {
	  let token = null;
	  if (typeof window !== 'undefined') {

	  	token = localStorage.getItem('token');

		}
		const userToken = token ;
		const result = new HttpHeaders(
			{
			
			'Content-Type': 'application/json; charset=utf-8',
			// 'Authorization': 'Bearer ' + userToken
		});
		return result;
	}


	getHTTPHeadersFormData(): HttpHeaders {
		let token = null;
		if (typeof window !== 'undefined') {
  
			token = localStorage.getItem('token');
  
		  }
		  const userToken = token ;
		  const result = new HttpHeaders(
			  {
				// 'Content-Type': 'multipart/form-data',

				'Content-Type': 'multipart/form-data; boundary=--xxxxSEPARATIONxxxx--'
			  // 'Authorization': 'Bearer ' + userToken
		  });
		  return result;
	  }

}
