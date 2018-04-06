
import { AppGlobal } from './../app/app.global';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VersionService {
    constructor(private http: AuthHttp) { }

    getVersion(platform: string, version: string) {
        return this.http.get(AppGlobal.getInstance().appVersionServer + `/api/appupgrade?appname=${AppGlobal.getInstance().appVersionAppName}&platform=${platform}&version=${version}`)
            .timeout(20000)
            .toPromise()
            .then(res => res.json());
    }
}
