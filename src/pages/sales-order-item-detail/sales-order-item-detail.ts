
//  Page
import { SalesOrderItem } from './../../models/salesorder-item.model';
import { ScanResult } from './../../models/scan-result.model';

//  Service
import { AppService } from './../../services/app.service';
import { SalesOrderService } from './../../services/sales-order.service';
import { StorageService } from './../../services/storage.service';

//  Module
import { CustomerSearch } from '../../models/customer-search.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

/**
 * Generated class for the SalesOrderItemDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-sales-order-item-detail',
    templateUrl: 'sales-order-item-detail.html',
})
export class SalesOrderItemDetailPage {
    isSignIn: boolean = false;
    customerSearch: CustomerSearch;
    data: any = {};
    salesOrderNumber;
    salesOrderItemNumber;
    constructor(
        public salesOrderService: SalesOrderService,
        public storageService: StorageService,
        public appService: AppService,
        public menuCtrl: MenuController,
        public navCtrl: NavController,
        public navParams: NavParams
    ){

    }
    ionViewDidLoad(){
        this.storageService.getIsSignIn().then(isSignIn => {
            this.isSignIn = isSignIn;
        });
        this.customerSearch = new CustomerSearch();
        if(this.navParams.get("CustomerSearch")){
            this.customerSearch = this.navParams.get("CustomerSearch");
        }
        this.salesOrderNumber = this.navParams.get("SalesOrderNumber");
        this.salesOrderItemNumber = this.navParams.get("SalesOrderItemNumber");
        if(this.navParams.get("ScanResult")){
            let scanResult: ScanResult = this.navParams.get("ScanResult");
            this.salesOrderNumber = scanResult.SalesOrderNumber;
            this.salesOrderItemNumber = scanResult.SalesOrderItemNumber;
        }
        this.loadData();
    }
    openMenu() {
        this.menuCtrl.enable(true, "left");
        this.menuCtrl.toggle("left");
    }
    doRefresh(event) {
        this.data = [];
        this.loadData().then(() => event.complete());
    }
    loadData(){
        return new Promise((resolve, reject) => {
            this.appService.showLoading();
            Promise.all([this.storageService.getDeviceID(), this.storageService.getSignInUser()]).then(result => {
                let deviceID = result[0];
                let signInUser = result[1];
                let params = {
                    CustomerCode: this.customerSearch.CustomerCode,
                    PurchaseOrderNumber: this.customerSearch.PurchaseOrderNumber,
                    SalesOrderNumber: this.salesOrderNumber,
                    SalesOrderItemNumber: this.salesOrderItemNumber,
                    DeviceID: deviceID,
                    CurrentUserEmail: signInUser ? signInUser.Email : ''
                };
                this.salesOrderService.getSalesOrderItemDetail(params).then(result => {
                    if (result.Data) {
                        this.data = result.Data;
                    }
                    this.appService.hideLoading();
                    resolve()
                }).catch(error => {
                    this.appService.hideLoading();
                    this.appService.translate("TimeoutText").subscribe(value => {
                        this.appService.alert(value);
                    });
                    reject()
                });
            });
        });
    }
}
