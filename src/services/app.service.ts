
//  Module
import { Injectable } from '@angular/core';
import { AppAvailability } from '@ionic-native/app-availability';
import { Clipboard } from '@ionic-native/clipboard';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, Platform, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';


declare let startApp;
@Injectable()
export class AppService {
    private loading;
    public isLoading: boolean = false;
    constructor(
        public translateService: TranslateService,
        public socialSharing: SocialSharing,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        public device: Device,
        public clipboard: Clipboard,
        public appAvailability: AppAvailability,
        public inAppBrowser: InAppBrowser,
        public platform: Platform
    ) {

    }
    showLoading(content?: string, showBackDrop: boolean = true) {
        this.loading = this.loadingCtrl.create({
            content: content,
            spinner: "crescent",
            showBackdrop: showBackDrop ? showBackDrop : true,
            dismissOnPageChange: false
        });
        this.loading.present();
        this.isLoading = true;
    }
    hideLoading() {
        this.loading.dismissAll();
        this.isLoading = false;
    }
    toast(message: any, position: string = "bottom", duration: number = 3000) {
        let toast = this.toastCtrl.create({
            message: message,
            position: position,
            duration: duration
        });
        toast.present();
    }
    alert(message: string) {
        this.translate("OKButtonText").subscribe(value => {
            let alert = this.alertCtrl.create({
                enableBackdropDismiss: false,
                message: message,
                buttons: [value]
            });
            alert.present();
        });
    }
    getDeviceID() {
        return this.device.uuid;
    }

    share(message, subject?, file?, url?) {
        return this.socialSharing.share(message, subject, file, url);
    }
    translate(key, params?): Observable<any> {
        return this.translateService.get(key, params);
    }
    pagination(array: Array<any>, page: number, pageSize: number): Array<any> {
        var offset = (page - 1) * pageSize;
        return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
    }

    launchExternalApp(iosSchemaName: string, androidPackageName: string) {
        return new Promise((resolve, reject) => {
            let sApp = null;
            let app: string;
            if (this.platform.is('android')) {
                app = androidPackageName;
                sApp = startApp.set({
                    "action": "ACTION_VIEW",
                    "package": androidPackageName
                }, {});
            } else {
                app = iosSchemaName;
                sApp = startApp.set(iosSchemaName);
            }
            this.appAvailability.check(app).then(
                () => {
                    sApp.start(function () {
                        resolve();
                    }, function (error) {
                        reject();
                    });
                },
                () => {
                    reject();
                }
            );
        });
    }

    openBaiduMap() {
        return this.launchExternalApp('baidumap://', 'com.baidu.BaiduMap');
    }
    openAMap() {
        return this.launchExternalApp('iosamap://', 'com.autonavi.minimap');
    }
    openGoogleMap() {
        return this.launchExternalApp('comgooglemaps://', 'com.google.android.apps.maps');
    }
    copyToClipboard(text: string) {
        return this.clipboard.copy(text);
    }
    drawQRCode(dataURL: string, text: string): Promise<HTMLCanvasElement> {
        let canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        let ctx = canvas.getContext("2d");
        let img = document.createElement("img");
        img.src = dataURL;
        return new Promise((resolve, reject) => {
            img.onload = function () {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, 300, 300);
                ctx.drawImage(img, 20, 20);
                ctx.fillStyle = '#000000';
                ctx.font = "16px Arial";
                ctx.textAlign = "center";
                ctx.fillText(text, 150, 285);
                resolve(canvas);
            };
        });
    }
}
