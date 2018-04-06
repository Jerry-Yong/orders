
//  Page
import { AppGlobal } from './../../app/app.global';
import { Setting } from './../../models/setting.model';

//  Service
import { AppService } from './../../services/app.service';
import { StorageService } from './../../services/storage.service';
import { VersionService } from './../../services/version.service';
import { FaqPage } from './../faq/faq';
import { IntroductionPage } from './../introduction/introduction';
import { SqliteServiceProvider } from "../../services/sqlite-service/sqlite-service";

//  Module
import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
})
export class AboutPage {
    public isSignIn: boolean = false;
    public setting: Setting = new Setting();
    public currentVersionNumber: string;
    public installUrl: string;
    public languages: any = [];
    constructor(
        public appService:AppService,
        public versionService: VersionService,
        public storageService: StorageService,
        public appVersion: AppVersion,
        public platform: Platform,
        public translateService: TranslateService,
        public navCtrl: NavController,
        public navParams: NavParams,
        public sqliteSer: SqliteServiceProvider,
    ){
        this.platform.ready().then(() => {
            try{
                console.log("this.setting--settings.js:",this.setting);
                this.sqliteSer.get((sqData:any) => {
                    console.log("sqData:",sqData);
                    // if(sqData.language){
                    //     this.setting.Language = sqData.language;
                    // }
                });
            }catch(error){

            }
        });

    }
    ionViewDidLoad() {
        this.loadData();
        this.appVersion.getVersionNumber().then(versionNumber => {
            this.currentVersionNumber = versionNumber;
        }).catch(error => {

        });
        this.installUrl = AppGlobal.getInstance().installUrl;
        this.storageService.getIsSignIn().then(isSignIn => {
            this.isSignIn = isSignIn;
        });
        this.storageService.getSetting().then(setting => {
            this.setting = setting;
            console.log("setting---65:",setting);
        });
    }
    openIntroductionPage() {
        this.navCtrl.push(IntroductionPage);
    }
    openFAQPage() {
        this.navCtrl.push(FaqPage);
    }
    loadData() {
        this.appService.translate('Languages').subscribe((res: string[]) => {
            this.languages = res
        });
    }
    changeSetting(){
        this.storageService.setSetting(this.setting);
        this.translateService.setDefaultLang(this.setting.Language);
        this.loadData();
        this.platform.ready().then(() => {
            try{
                console.log("this.setting--settings.js:",this.setting);
                this.sqliteSer.upDateLanguage(this.setting.Language);
            }catch(error){

            }
        });
    }
}
