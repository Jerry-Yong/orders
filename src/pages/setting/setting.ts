
//  Page
import { Setting } from './../../models/setting.model';

//  Service
import { AppService } from './../../services/app.service';
import { FingerprintService } from './../../services/fingerprint.service';
import { StorageService } from './../../services/storage.service';
import { SqliteServiceProvider } from "../../services/sqlite-service/sqlite-service";

//  Module
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { KeychainTouchId } from "@ionic-native/keychain-touch-id";

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html',
})
export class SettingPage {
    public supportFingerprint: boolean = false;
    public setting: Setting = new Setting();
    public languages: any = [];
    public defaultPages: any = [];
    public sqlite_language:string;
    public sqlite_defaultPage:string;
    constructor(
        public appService: AppService,
        public fingerprintService: FingerprintService,
        public storageService: StorageService,
        public translateService: TranslateService,
        public navCtrl: NavController,
        public navParams: NavParams,
        public sqliteSer: SqliteServiceProvider,
        public platform: Platform,
        public keychainTouchId: KeychainTouchId,
    ){

    }
    ionViewDidLoad(){
        this.loadData();
        // this.fingerprintService.isAvailable().then(result => {
        //     this.supportFingerprint = true;
        // }).catch(error => {
        //     this.supportFingerprint = false;
        // });
        this.keychainTouchId.isAvailable().then((res: any) => {
            this.supportFingerprint = true;
        }).catch(error => {
            this.supportFingerprint = false;
        });
        this.storageService.getSetting().then(setting => {
            this.setting = setting;
        });
    }
    loadData(){
        this.appService.translate('Languages').subscribe((res: string[]) => {
            this.languages = res;
            // this.sortLanguage(res);
        });
        this.appService.translate('DefaultPages').subscribe((res: string[]) => {
            this.defaultPages = res;
            // this.sortDefaultPage(res);
        });
    }
    changeSetting(type){
        this.setting.TouchID = this.setting.TouchID.toString().toLowerCase();
        this.storageService.setSetting(this.setting);
        this.translateService.setDefaultLang(this.setting.Language);
        this.loadData();
        this.platform.ready().then(() => {
            try{
                if(type == "language"){
                    this.sqliteSer.upDateLanguage(this.setting.Language);
                }else if(type == "touchIDEnable"){
                    this.sqliteSer.upDateEnable(this.setting.TouchID);
                }else if(type == "startPage"){
                    this.sqliteSer.upDateDefaultPage(this.setting.DefaultPage);
                }
            }catch(error){

            }
        });
    }
    sortLanguage(arr){
        this.platform.ready().then(() => {
            try{
                this.sqliteSer.get((sqData:any) => {
                    console.log("sqData--103--settings:",sqData);
                    arr.sort((item) => {
                        if(item.Value == sqData.language){
                            return -1;
                        }else{
                            return 1;
                        }
                    });
                    this.languages = arr;
                });
            }catch(error){
                console.log(error);
            }
        });
    }
    sortDefaultPage(arr){
        this.platform.ready().then(() => {
            try{
                this.sqliteSer.get((sqData:any) => {
                    arr.sort((item) => {
                        if(item.Value == sqData.defaultPage){
                            return -1;
                        }else{
                            return 1;
                        }
                    });
                    this.defaultPages = arr;
                });
            }catch(error){
                console.log(error);
            }
        });
    }
}
