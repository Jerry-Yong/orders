
//  Page
import { Setting } from './../models/setting.model';
import { CustomerSearchPage } from './../pages/customer-search/customer-search';
import { SignInPage } from './../pages/sign-in/sign-in';

//  Service
import { AppService } from './../services/app.service';
import { StorageService } from './../services/storage.service';
import { TokenService } from './../services/token.service';
import { AppGlobal } from './app.global';
import { VersionService } from '../services/version.service';
import { SqliteServiceProvider } from "../services/sqlite-service/sqlite-service";

//  Module
import { Component, ViewChild } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { Globalization } from '@ionic-native/globalization';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { App, Nav, Platform } from 'ionic-angular';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = CustomerSearchPage;
    public setting: Setting;
    constructor(
        private googleAnalytics: GoogleAnalytics,
        public keyboard: Keyboard,
        public appService: AppService,
        public versionService: VersionService,
        public inAppBrowser: InAppBrowser,
        public appVersion: AppVersion,
        public storageService: StorageService,
        public translateService: TranslateService,
        public tokenService: TokenService,
        public globalization: Globalization,
        public device: Device,
        public app: App,
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public sqliteSer: SqliteServiceProvider,
    ){
        this.platform.ready().then(() => {
            this.initializeApp();
            try{
                this.sqliteSer.createTable(data => {
                    console.log("data--57:",data);
                    // this.initializeApp();
                    this.sqliteSer.get((sqData) => {
                        console.log("sqData--59:",sqData);
                        if(sqData.loginPage == "ABBLogin"){
                            this.rootPage = SignInPage;
                        }else{
                            this.rootPage = CustomerSearchPage;
                        }
                        if(sqData.language == "zh-CN"){
                            this.translateService.setDefaultLang("zh-CN");
                        }else if(sqData.language == "en-US"){
                            this.translateService.setDefaultLang("en-US");
                        }else{
                            this.globalization.getPreferredLanguage().then(language => {
                                console.log("language:",language);
                                if(language.value.indexOf("zh") > -1){
                                    this.translateService.setDefaultLang("zh-CN");
                                }else{
                                    this.translateService.setDefaultLang("en-US");
                                }
                            }).catch(error => {
                                this.translateService.setDefaultLang("en-US");
                            });
                        }
                        // if(sqData.defaultPage == "QuickSearchPage"){
                        //
                        // }else{
                        //
                        // }
                    });
                });
            }catch(error){
                // this.initializeApp();
            }
        })
    }

    initializeApp(){
        this.platform.ready().then(() => {
            this.keyboard.hideKeyboardAccessoryBar(true);
            this.keyboard.disableScroll(false);
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            // this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.initializeStorage();
            this.initializeAppSetting();
            this.initializeGoogleAnalytics();
            // this.checkAppUpdate();
        });
    }
    initializeAppSetting() {
        this.setting = new Setting();
        this.setting.Language = "en-US";
        this.setting.DefaultPage = "QuickSearchPage";
        this.setting.TouchID = "";
        this.storageService.getSetting().then(result => {
            if(result){
              this.setting = result;
              // this.translateService.setDefaultLang(this.setting.Language);
            }else{
                this.globalization.getPreferredLanguage().then(language => {
                    console.log("language:",language);
                    if(language.value.indexOf("zh") > -1){
                        this.setting.Language = "zh-CN";
                    }
                    // this.translateService.setDefaultLang(this.setting.Language);
                    this.storageService.setSetting(this.setting);
                }).catch(error => {
                    // this.translateService.setDefaultLang(this.setting.Language);
                    this.storageService.setSetting(this.setting);
                });
            }
        }).catch(error => {

        });
        // this.storageService.getSignInUser().then(signInUser => {
        //     if(signInUser){
        //         this.rootPage = SignInPage;
        //     }
        // });
    }
    initializeStorage() {
        this.storageService.setDeviceID(this.device.uuid);
        this.storageService.setIsSignIn(false);
    }
    initializeGoogleAnalytics() {
        this.platform.ready().then(() => {
            this.googleAnalytics.startTrackerWithId(AppGlobal.getInstance().googleAnalyticsID).then(() => {
                console.log('Google analytics is ready now');
                //the component is ready and you can call any method here
                // this.googleAnalytics.debugMode();
                this.googleAnalytics.setAllowIDFACollection(false);
                this.app.viewWillEnter.subscribe(viewCtrl => {
                    if (viewCtrl._cssClass == "ion-page" && viewCtrl.id.indexOf("Page") > -1) {
                        this.googleAnalytics.trackView(viewCtrl.id);
                    }
                });
            }).catch(e => console.log('Error starting GoogleAnalytics', e));
        });
    }
    checkAppUpdate(){
        this.appVersion.getVersionNumber().then(currentVersion => {
            let platformName = this.platform.is("android") ? "android" : "ios";
            this.versionService.getVersion(platformName, currentVersion).then(result => {
                if (result.Code == 200) {
                    var arrayLocalVersion = currentVersion.split('.');
                    var arrayServerVersion = result.Data.Version.split('.');
                    if (currentVersion != result.Data.Version &&
                        (
                            (parseInt(arrayServerVersion[0]) > parseInt(arrayLocalVersion[0]))
                            ||
                            (arrayServerVersion[0] == arrayLocalVersion[0] &&
                              parseInt(arrayServerVersion[1]) > parseInt(arrayLocalVersion[1])
                            )
                            ||
                            (arrayServerVersion[0] == arrayLocalVersion[0] && arrayServerVersion[1] == arrayLocalVersion[1] &&
                              parseInt(arrayServerVersion[2]) > parseInt(arrayLocalVersion[2])
                            )
                        )
                    ) {
                        Promise.all([
                            this.appService.translate("Common.CheckForUpdate").toPromise(),
                            this.appService.translate("InstallButtonText").toPromise(),
                            this.appService.translate("CancelButtonText").toPromise()
                        ]).then(translate => {
                            if(result.Data.ForceUpdate){
                                let alert = this.appService.alertCtrl.create({
                                    enableBackdropDismiss:false,
                                    title: translate[0],
                                    cssClass:"update-alert",
                                    message: result.Data.Description.replace(/\[\$\$\$\]/g, "<br/>"),
                                    buttons: [{
                                        text: translate[1],
                                        handler: () => {
                                            this.inAppBrowser.create(result.Data.Url, "_system", "EnableViewPortScale=yes;location=no;");
                                        }
                                    }]
                                });
                                alert.present();
                            }else{
                                let alert = this.appService.alertCtrl.create({
                                    enableBackdropDismiss:false,
                                    title: translate[0],
                                    cssClass:"update-alert",
                                    message: result.Data.Description.replace(/\[\$\$\$\]/g, "<br/>"),
                                    buttons: [{
                                        text: translate[2],
                                        role: 'cancel',
                                        handler: () => {

                                        }
                                    },
                                    {
                                        text: translate[1],
                                        handler: () => {
                                            this.inAppBrowser.create(result.Data.Url, "_system", "EnableViewPortScale=yes;location=no;");
                                        }
                                    }]
                                });
                                alert.present();
                            }
                        });
                    }
                }
            }).catch(error => {

            });
        }).catch(error => {

        });
    }
}
