import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SettingService {

    /**
     *  This service is managing the settings of the users.
     *  It is using rxjs subject to manage asynchronous
     *  modification from several components.
     */

    listRefreshRate = 10; // refresh time in sec
    listRefreshRateSubject = new Subject<number>();


    emitListRefreshSubject() {
        this.listRefreshRateSubject.next(this.listRefreshRate.valueOf());
    }

    updateRefreshRate(newRate: number) {
        this.listRefreshRate = newRate;
        this.emitListRefreshSubject();
    }

}