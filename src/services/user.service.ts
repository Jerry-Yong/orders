
//  Module
import { AppGlobal } from './../app/app.global';
import { SignIn } from './../models/sign-in.model';
import { EncryptService } from './encrypt.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Headers, RequestOptionsArgs } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
    constructor(
        private http: AuthHttp,
        private storageService: StorageService,
        private encryptService: EncryptService
    ){

    }
    signIn(email: string, password: string, deviceID: string) {
        let body = {
            Email: this.encryptService.Encrypt(email),
            Password: this.encryptService.Encrypt(password),
            DeviceID: deviceID
        };
        return this.http.post(AppGlobal.getInstance().apiServer + '/api/User/SignIn', body)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }
    fingerprintSignIn(token: string, email: string, deviceID: string) {
        let body = {
            Token: token,
            Email: email,
            DeviceID: deviceID
        };
        return this.http.post(AppGlobal.getInstance().apiServer + '/api/User/FingerprintSignIn', body)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }

}
