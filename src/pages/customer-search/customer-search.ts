
//  Page
import { CustomerSearch } from './../../models/customer-search.model';
import { ScanResult } from './../../models/scan-result.model';
import { AboutPage } from './../about/about';
import { SalesOrderItemPage } from './../sales-order-item/sales-order-item';
import { SignInPage } from './../sign-in/sign-in';
import { CheckVersionPopup } from "./checkVersionPopup/index";

//  Service
import { AppService } from './../../services/app.service';
import { BarcodeScannerService } from './../../services/barcodescanner.service';
import { QRCodeService } from './../../services/qrcode.service';
import { StorageService } from './../../services/storage.service';

//  Module
import { Component, OnInit, ViewChild} from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, MenuController, NavController, NavParams, Platform } from 'ionic-angular';
/**
 * Generated class for the CustomerSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
    selector: 'page-customer-search',
    templateUrl: 'customer-search.html'
})
export class CustomerSearchPage implements OnInit{
    @ViewChild('child')
    child: CheckVersionPopup;

    public customerSearch: CustomerSearch = new CustomerSearch();
    constructor(
        public appService: AppService,
        public qrcodeService: QRCodeService,
        public barcodeScannerService: BarcodeScannerService,
        public storageService: StorageService,
        private keyboard: Keyboard,
        public platform: Platform,
        public translateService: TranslateService,
        public navCtrl: NavController,
        public navParams: NavParams
    ){
        this.platform.ready().then(() => {
            this.keyboard.onKeyboardShow().subscribe(() => {
                document.body.classList.add('keyboard-is-open');
            });
            this.keyboard.onKeyboardHide().subscribe(() => {
                document.body.classList.remove('keyboard-is-open');
            });
        });
    }
    ngOnInit(){
        this.platform.ready().then( () => {
            this.child.checkVersion((data:any) => {
                console.log("data---62:",data);
                // if(!data.Data.Update){
                //     // this.touchIDLogin();
                // }
            });
        });
    }
    ionViewDidLoad(){
        this.storageService.getCustomerSearchCustomerCode().then(customerCode => {
            this.customerSearch.CustomerCode = customerCode;
        });
    }
    openScan(){
        this.barcodeScannerService.scan().then(result => {
            if(result.cancelled){
                return false;
            }
            try{
                let scanResult: CustomerSearch = JSON.parse(result.text);
                this.customerSearch.PurchaseOrderNumber = scanResult.PurchaseOrderNumber;
                if (this.customerSearch.PurchaseOrderNumber && this.customerSearch.CustomerCode) {
                    this.navCtrl.push(SalesOrderItemPage, { CustomerSearch: this.customerSearch });
                }
            }catch (error){
                this.appService.translate("Common.QRCodeFormatFailed").subscribe(value => {
                    this.appService.alert(value);
                });
            }
        }).catch(error => {
            this.appService.translate("Common.QRCodeScanFailed").subscribe(value => {
                this.appService.alert(value);
            });
        });
    }
    openAboutPage(){
        this.navCtrl.push(AboutPage, { isSignIn: false });
    }
    search(){
        //validation
        if(this.customerSearch.CustomerCode == '' || this.customerSearch.CustomerCode == undefined){
            this.appService.translate("CustomerSearchPage.CustomerCodeRequired").subscribe(value => {
                this.appService.alert(value);
            });
            return;
        }
        if(this.customerSearch.PurchaseOrderNumber == '' || this.customerSearch.PurchaseOrderNumber == undefined){
            this.appService.translate("CustomerSearchPage.PurchaseOrderNumberRequired").subscribe(value => {
                this.appService.alert(value);
            });
            return;
        }
        this.customerSearch.CustomerCode = this.customerSearch.CustomerCode.trim();
        this.customerSearch.PurchaseOrderNumber = this.customerSearch.PurchaseOrderNumber.trim();
        this.navCtrl.push(SalesOrderItemPage, { CustomerSearch: this.customerSearch });
    }
    openSignInPage(){
        this.navCtrl.push(SignInPage,{isCheckAppVersion: false});
    }
}
