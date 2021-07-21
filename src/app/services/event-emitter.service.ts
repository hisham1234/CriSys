import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  private subject = new Subject<any>();
  sendClickEvent() {
    this.subject.next();
  //  console.log('sendClickEvent');
  }
  getClickEvent(): Observable<any> {
   // console.log('getClickEvent');
    return this.subject.asObservable();
  }
}
