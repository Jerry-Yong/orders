
//  Module
import { Component, EventEmitter, Output,Injectable} from "@angular/core";
import { Platform, AlertController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
// import { TranslateService} from "ng2-translate";

//  Service
import { VersionService } from "../../../services/version.service";
import { AppService } from "../../../services/app.service";


@Component({
    selector: 'check-version-popup',
    templateUrl: 'index.html',
    providers: []
})
export class CheckVersionPopup{

    showCheckAlertFlag:boolean = false;
    checkVersionPopupMessage:any = [];
    checkVersionPopupBtn:any = [];
    downloadAPPURL:string = "";
    checkVersionPopupTitle:string = "";

    @Output() toTouchIDLogin: EventEmitter<number> = new EventEmitter();

    constructor(
        private platform: Platform,
        private appVersion: AppVersion,
        private inAppBrowser: InAppBrowser,
        private appVersionService: VersionService,
        public appService: AppService,
        // private translate: TranslateService,
        // private dialogProvider: DialogProvider,
    ){


    }
    versionClick(btn){
        if(btn.Code == "0"){
            this.showCheckAlertFlag = false;
            this.toTouchIDLogin.emit();
        }else if(btn.Code == "1"){
            this.showCheckAlertFlag = true;
            this.openUrlByBrowser(this.downloadAPPURL);
        }
    }
    checkVersion(callback){
        if(!this.isMobile()){
            return;
        }
        let _platfrom = "android";
        if(this.isIos()){
            _platfrom = "ios";
        }
        this.getVersionNumber().then(version => {
            this.appService.showLoading();
            this.appVersionService.getVersion(_platfrom, version).then(data => {
                this.appService.hideLoading();
                if(data.Code == 200){
                    callback(data);
                    if(!data.Data.Update){
                        this.showCheckAlertFlag = false;
                    }else{
                        this.showCheckAlertFlag = true;
                        Promise.all([
                            this.appService.translate("CheckVersionTitle").toPromise(),
                            this.appService.translate("InstallButtonText").toPromise(),
                            this.appService.translate("CancelButtonText").toPromise()
                        ]).then(result => {
                            console.log("result:",result);
                            this.checkVersionPopupTitle = result[0] + " ( "+ data.Data.Version + " )";
                            if(data.Data.Description){
                                if(data.Data.Description.indexOf("[$$$]")){
                                    let str = data.Data.Description.split("[$$$]");
                                    this.checkVersionPopupMessage = str;
                                }
                            }
                            if(data.Data.ForceUpdate){
                                this.checkVersionPopupBtn = [{Name:result[1],Code:"1"}];
                            }else{
                                this.checkVersionPopupBtn = [{Name:result[2],Code:"0"},{Name:result[1],Code:"1"}];
                            }
                            this.downloadAPPURL = data.Data.Url;
                        });
                    }
                }
            }).catch(error => {
                this.appService.hideLoading();
                this.appService.translate("TimeoutText").subscribe(value => {
                    this.appService.alert(value);
                });
            });
        });
    }
    openUrlByBrowser(url: string):void {
        this.platform.ready().then( () => {
            this.inAppBrowser.create(url, '_system');
        });
    }

    /**
    * 是否真机环境 *
    * @returns {boolean}
    * @memberof NativeService
    */
    isMobile(): boolean {
        return this.platform.is('mobile') && !this.platform.is('mobileweb');
    }

    /**
    * 是否Android真机环境 *
    * @returns {boolean}
    * @memberof NativeService
    */
    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    /**
    * 是否IOS真机环境 *
    * @returns {boolean}
    * @memberof NativeService
    */
    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }

    /**
    * 获得app版本号,如0.01
    * @description  对应/config.xml中version的值
    * @returns {Promise<string>}
    */
    getVersionNumber(): Promise<string> {
        return new Promise((resolve) => {
            this.appVersion.getVersionNumber().then((value: string) => {
                resolve(value);
            }).catch(err => {
                // console.log('getVersionNumber:' + err);
            });
        });
    }
}
