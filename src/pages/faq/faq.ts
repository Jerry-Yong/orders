
//  Page
import { AppGlobal } from './../../app/app.global';

//  service
import { StorageService } from './../../services/storage.service';

//  Module
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InAppBrowser, InAppBrowserObject, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-faq',
    templateUrl: 'faq.html',
})
export class FaqPage {
    iframe: SafeResourceUrl;
    url: string;
    constructor(
        private storageService: StorageService,
        private sanitizer: DomSanitizer,
        public navCtrl: NavController,
        public navParams: NavParams
    ){

    }
    ionViewDidLoad() {
        //重置页面
        this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl("");
        this.storageService.getSetting().then(setting => {
            this.url = `${AppGlobal.getInstance().apiServer}/faq_${setting.Language}.html`;
            setTimeout(() => {
                // 重新加载
                this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
            }, 10);
        });
    }
}
