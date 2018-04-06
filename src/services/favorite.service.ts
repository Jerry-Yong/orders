

import { AppGlobal } from './../app/app.global';
import { Favorite } from './../models/favorite.model';
import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';

@Injectable()
export class FavoriteService {
    constructor(private http: AuthHttp) {

    }
    getList(createdBy: string){
        let body=`createdBy=${createdBy}`;
        return this.http.get(`${AppGlobal.getInstance().apiServer}/api/Favorite?${body}`)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }
    add(params: Favorite){
        return this.http.post(AppGlobal.getInstance().apiServer + '/api/Favorite', params)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }
    delete(id: string){
        return this.http.delete(`${AppGlobal.getInstance().apiServer}/api/Favorite/${id}`)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }
}
