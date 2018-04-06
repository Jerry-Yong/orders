import { AppGlobal } from './../app/app.global';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenService {
    constructor(private http: Http) {

    }
    getToken() {
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let body=`client_id=${AppGlobal.getInstance().apiClientID}&grant_type=password&username=${AppGlobal.getInstance().watchdogApplication}&password=${AppGlobal.getInstance().watchdogApplicationPassword}`;
        return this.http.post(AppGlobal.getInstance().watchdogServer + '/oauth2/token', body, { headers: headers })
            .timeout(30000)
            .toPromise()
            .then(res => res.json());
    }
}
