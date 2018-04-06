

//  Page
import { Setting } from './../../models/setting.model';
import { SignInUser } from './../../models/sign-in-user.model';
import { FavoritePage } from "../favorite/favorite";
import { QuickSearchPage } from "../quick-search/quick-search";
import { SettingPage } from "../setting/setting";
import { AboutPage } from "../about/about";
import { CustomerSearchPage } from "../customer-search/customer-search";

//  Service
import { StorageService } from './../../services/storage.service';
import { SqliteServiceProvider } from "../../services/sqlite-service/sqlite-service";

//  Module
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-main',
    templateUrl: 'main.html',
})
export class MainPage{
    @ViewChild(Nav) nav: Nav;
    rootPage: any;

    public setting: Setting;
    public signInUser: SignInUser;
    constructor(
        public storageService: StorageService,
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public sqliteSer: SqliteServiceProvider,
    ){

    }
    ionViewDidLoad(){
        this.platform.ready().then(() => {
            try{
                this.sqliteSer.createTable(data => {
                    // console.log("data--57:",data);
                    this.sqliteSer.get((sqData) => {
                        console.log("sqData-main.js-53:",sqData);
                        if(sqData.defaultPage == "QuickSearchPage"){
                            this.rootPage = QuickSearchPage;
                        }else if(sqData.defaultPage == "FavoritePage"){
                            this.rootPage = FavoritePage;
                        }else if(sqData.defaultPage == "SettingPage"){
                            this.rootPage = SettingPage;
                        }else if(sqData.defaultPage == "AboutPage"){
                            this.rootPage = AboutPage;
                        }
                    });
                });
            }catch(error){

            }
        })
        this.storageService.getSetting().then(setting => {
            this.setting = setting;

            //  start ...
            console.log("this.setting:",this.setting);
            // if(this.setting.DefaultPage == "QuickSearchPage"){
            //     this.rootPage = QuickSearchPage;
            // }else if(this.setting.DefaultPage == "FavoritePage"){
            //     this.rootPage = FavoritePage;
            // }else if(this.setting.DefaultPage == "SettingPage"){
            //     this.rootPage = SettingPage;
            // }else if(this.setting.DefaultPage == "AboutPage"){
            //     this.rootPage = AboutPage;
            // }
            // this.rootPage = this.setting.DefaultPage;
            //  ... end
        });
        this.storageService.getSignInUser().then(signInUser => {
            this.signInUser = signInUser;
        });
    }
    openPage(page){
        //  start ...
        if(page == "QuickSearchPage"){
            // this.rootPage = QuickSearchPage;
            this.nav.setRoot(QuickSearchPage);
        }else if(page == "FavoritePage"){
            this.nav.setRoot(FavoritePage);
        }else if(page == "SettingPage"){
            // this.rootPage = SettingPage;
            this.nav.setRoot(SettingPage);
        }else if(page == "AboutPage"){
            // this.rootPage = AboutPage;
            this.nav.setRoot(AboutPage);
        }
        // this.nav.setRoot(page);
        //  ... end
    }
    logout(){
        this.storageService.setSignInUser(null);
        this.storageService.setIsSignIn(false);
        //初始TouchID登录状态
        this.setting.TouchID = "";
        this.storageService.setSetting(this.setting);
        this.nav.setRoot(CustomerSearchPage);
    }
}
