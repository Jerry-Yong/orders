import { Setting } from './../models/setting.model';
import { SignInUser } from './../models/sign-in-user.model';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable()
export class StorageService {

    constructor(
        public localStorage: Storage
    ){

    }
    getIsSignIn(): Promise<boolean> {
        return this.localStorage.get("IsSignIn");
    }

    setIsSignIn(value: boolean) {
        this.localStorage.set("IsSignIn", value);
    }
    getSignInUser(): Promise<SignInUser> {
        return this.localStorage.get("SignInUser");
    }
    setSignInUser(value: SignInUser) {
        this.localStorage.set("SignInUser", value);
    }
    getSetting(): Promise<Setting> {
        return this.localStorage.get("Setting");
    }
    setSetting(value: Setting) {
        this.localStorage.set("Setting", value);
    }
    getToken() {
        return this.localStorage.get("AccessToken");
    }
    setToken(value) {
        this.localStorage.set("AccessToken", value);
    }
    getRefreshToken() {
        return this.localStorage.get("RefreshToken");
    }
    setRefreshToken(value) {
        this.localStorage.set("RefreshToken", value);
    }

    getDeviceID() {
        return this.localStorage.get("DeviceID");
    }
    setDeviceID(value) {
        if (!value) {
            value = "123456789";
        }
        this.localStorage.set("DeviceID", value);
    }
    getQuickSearchHistory(key: string) {
        return this.localStorage.get(`QuickSearchHistory_${key}`);
    }
    setQuickSearchHistory(key: string, value: any) {
        this.localStorage.set(`QuickSearchHistory_${key}`, value);
    }
    addQuickSearchHistory(key: string, value: any) {
        this.getQuickSearchHistory(key).then((history: Array<string>) => {
            if (!history) {
                history = [];
            }
            history.forEach((v, i) => {
                if (v.toLowerCase() == value.toLowerCase()) {
                    history.splice(i, 1);
                }
            });
            history.unshift(value);
            if (history && history.length > 10) {
                history.splice(history.length - 1, 1);
            }

            this.setQuickSearchHistory(key, history);
        });
    }
    getCustomerSearchCustomerCode() {
        return this.localStorage.get("CustomerSearchCustomerCode");
    }
    setCustomerSearchCustomerCode(value) {
        this.localStorage.set("CustomerSearchCustomerCode", value);
    }
}
