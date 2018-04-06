import { AppService } from './app.service';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
// import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
// import { TouchID } from '@ionic-native/touch-id';
import { Platform } from 'ionic-angular';

@Injectable()
export class FingerprintService {

    constructor(
        private appService: AppService,
        private storageService: StorageService,
        private platform: Platform,
        // private touchId: TouchID,
        // private androidFingerprintAuth: AndroidFingerprintAuth,
    ) { }
    // isAvailable() {
    //     return new Promise((resolve, reject) => {
    //         if (this.platform.is("android")) {
    //             this.androidFingerprintAuth.isAvailable()
    //                 .then((result: any) => resolve(result))
    //                 .catch((error: any) => {
    //                     reject(error);
    //                 });
    //         } else {
    //             this.touchId.isAvailable()
    //                 .then((result: any) => resolve(result))
    //                 .catch((error: any) => reject(error));
    //         }
    //     });
    // }
    // authenticate() {
    //     return new Promise((resolve, reject) => {
    //         this.storageService.getSetting().then(setting => {
    //             this.appService.translate("Common.FingerprintTip").subscribe(value => {
    //                 if (this.platform.is("android")) {
    //                     this.androidFingerprintAuth.encrypt({
    //                         clientId: 'app',
    //                         username: 'app',
    //                         password: 'appkey1234567890!@#$%^&*()',
    //                         locale: setting.Language,
    //                         dialogMessage: value
    //                     })
    //                         .then((result: any) => resolve(result))
    //                         .catch((error: any) => reject(error));
    //                 } else {
    //                     this.touchId.verifyFingerprint(value)
    //                         .then((result: any) => resolve(result))
    //                         .catch((error: any) => reject(error));
    //                 }
    //             });
    //         });
    //
    //     });
    // }
}
