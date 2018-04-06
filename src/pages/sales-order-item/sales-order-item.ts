
//  Page
import { CustomerSearch } from './../../models/customer-search.model';
import { Favorite } from './../../models/favorite.model';
import { ScanResult } from './../../models/scan-result.model';
import { SalesOrderItemDetailPage } from './../sales-order-item-detail/sales-order-item-detail';

//  Service
import { AppService } from './../../services/app.service';
import { FavoriteService } from './../../services/favorite.service';
import { QRCodeService } from './../../services/qrcode.service';
import { SalesOrderService } from './../../services/sales-order.service';
import { StorageService } from './../../services/storage.service';

//  Module
import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the SalesOrderItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-sales-order-item',
    templateUrl: 'sales-order-item.html',
})
export class SalesOrderItemPage {
    isSignIn: boolean = false;
    //Search Filter
    public orderBy: string = "SalesOrderItemNumber Desc";
    public status: string = "";
    public customerSearch: CustomerSearch;
    salesOrderNumber: string = "";
    //List
    data: any = [];
    public hasMore: boolean = true;
    public start: number = 0;
    public count: number = 10;
    //Filter
    selectEstimatedExWorkDate: string = "";
    estimatedExWorkStartDate: string;
    estimatedExWorkEndDate: string;
    selectShippingDate: string = "";
    shippingStartDate: string;
    shippingEndDate: string;
    salesOrderItemNumber: string;
    meterCode: string;
    constructor(
        public appService: AppService,
        public qrCodeService: QRCodeService,
        public salesOrderService: SalesOrderService,
        public favoriteService: FavoriteService,
        public storageService: StorageService,
        public menuCtrl: MenuController,
        public navCtrl: NavController,
        public navParams: NavParams
    ){

    }

    ionViewDidLoad() {
        this.storageService.getIsSignIn().then(isSignIn => {
            this.isSignIn = isSignIn;
        });
        this.salesOrderNumber = this.navParams.get("SalesOrderNumber");
        this.customerSearch = new CustomerSearch();
        if(this.navParams.get("CustomerSearch")){
            this.customerSearch = this.navParams.get("CustomerSearch");
            this.storageService.setCustomerSearchCustomerCode(this.customerSearch.CustomerCode);
        }
        if(this.navParams.get("ScanResult")){
            let scanResult: ScanResult = this.navParams.get("ScanResult");
            this.salesOrderNumber = scanResult.SalesOrderNumber;
            this.salesOrderItemNumber = scanResult.SalesOrderItemNumber;
        }
        this.loadData();
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(true, 'sales-item-filter');
    }
    loadData() {
        return new Promise((resolve, reject) => {
            this.appService.showLoading();
            Promise.all([this.storageService.getDeviceID(), this.storageService.getSignInUser()]).then(result => {
                let deviceID = result[0];
                let signInUser = result[1];
                let params = {
                    SalesOrderNumber: this.salesOrderNumber,
                    CustomerCode: this.customerSearch.CustomerCode,
                    PurchaseOrderNumber: this.customerSearch.PurchaseOrderNumber,
                    OrderBy: this.orderBy,
                    Status: this.status,
                    Start: this.start,
                    Count: this.count,
                    EstimatedExWorkStartDate: this.estimatedExWorkStartDate,
                    EstimatedExWorkEndDate: this.estimatedExWorkEndDate,
                    ShippingStartDate: this.shippingStartDate,
                    ShippingEndDate: this.shippingEndDate,
                    SalesOrderItemNumber: this.salesOrderItemNumber,
                    MeterCode: this.meterCode,
                    DeviceID: deviceID,
                    CurrentUserEmail: signInUser ? signInUser.Email : ''
                };
                this.salesOrderService.getSalesOrderItemList(params).then(result => {
                    if(result.Data){
                        if (result.Data.length < this.count) {
                            this.hasMore = false;
                        }
                        this.start = this.start + this.count;
                        this.data = this.data.concat(result.Data);
                    }
                    this.appService.hideLoading();
                    resolve();
                }).catch(error => {
                    this.appService.hideLoading();
                    this.appService.translate("TimeoutText").subscribe(value => {
                        this.appService.alert(value);
                    });
                    reject();
                });
            });
        });
    }
    doRefresh(event) {
        this.data = [];
        this.start = 0;
        this.count = 10;
        this.loadData().then(() => event.complete());
    }
    doInfinite(event) {
        if(!this.hasMore){
            return;
        }
        this.loadData().then(data => event.complete());
    }
    openMenu() {
        this.menuCtrl.enable(true, "left");
        this.menuCtrl.toggle("left");
    }
    toggleFilter() {
        this.menuCtrl.toggle("sales-item-filter");
    }
    openSalesOrderItemDetail(item){
        // this.navCtrl.push("SalesOrderItemDetailPage", {
        this.navCtrl.push(SalesOrderItemDetailPage, {
            CustomerSearch: this.customerSearch,
            SalesOrderNumber: item.SalesOrderNumber,
            SalesOrderItemNumber: item.SalesOrderItemNumber
        });
    }
    share(item){
        let params: ScanResult = {
            SalesOrderNumber: item.SalesOrderNumber,
            SalesOrderItemNumber: item.SalesOrderItemNumber,
            PurchaseOrderNumber: item.PurchaseOrderNumber
        };
        this.qrCodeService.encode(JSON.stringify(params)).then(dataURL => {
            this.appService.drawQRCode(dataURL.toString(), item.SalesOrderNumber + " - " + item.SalesOrderItemNumber).then((canvas) => {
                this.appService.hideLoading();
                this.appService.share(null, 'QR Code', canvas.toDataURL(), null).then(result => {

                }).catch(error => {
                    this.appService.translate("Common.ShareFailed").subscribe(value => {
                        this.appService.toast(value);
                    });
                });
            });
        }).catch(error => {

        });
    }
    favorite(item, index) {
        this.appService.showLoading();
        this.storageService.getSignInUser().then(signInUser => {
            if (item.IsFavorite) {
                this.favoriteService.delete(item.FavoriteID).then(result => {
                    if(result.Success){
                        this.appService.translate("Common.DeleteFavoriteSuccess").subscribe(value => {
                            this.appService.toast(value);
                        });
                        this.data[index].IsFavorite = false;
                    }
                    this.appService.hideLoading();
                }).catch(error => {
                    this.appService.translate("Common.DeleteFavoriteFailed").subscribe(value => {
                        this.appService.toast(value);
                    });
                    this.appService.hideLoading();
                });
            }else{
                let params = new Favorite();
                params.FavoriteType = 2;
                params.CustomerCode = item.CustomerCode;
                params.CustomerName = item.CustomerName;
                params.SalesOrderNumber = item.SalesOrderNumber;
                params.SalesOrderItemNumber = item.SalesOrderItemNumber;
                params.CreatedBy = signInUser.Email;
                this.favoriteService.add(params).then(result => {
                    if (result.Success) {
                        this.appService.translate("Common.AddFavoriteSuccess").subscribe(value => {
                            this.appService.toast(value);
                        });
                        this.data[index].IsFavorite = true;
                        this.data[index].FavoriteID = result.Data;
                    }
                    this.appService.hideLoading();
                }).catch(error => {
                    this.appService.translate("Common.AddFavoriteFailed").subscribe(value => {
                        this.appService.toast(value);
                    });
                    this.appService.hideLoading();
                });
            }
        });
    }
    onChangeSortFilter(event) {
        this.data = [];
        this.start = 0;
        this.count = 10;
        this.loadData();
    }
    resetFilter() {
        this.selectEstimatedExWorkDate = "";
        this.estimatedExWorkStartDate = null;
        this.estimatedExWorkEndDate = null;
        this.selectShippingDate = "";
        this.shippingStartDate = null;
        this.shippingEndDate = null;
        this.salesOrderItemNumber = null;
        this.meterCode = null;
    }
    filter() {
        this.data = [];
        this.start = 0;
        this.count = 10;
        this.loadData().then(data => this.toggleFilter());
    }
    changeEstimatedExWorkDate() {
        var t = new Date();
        this.estimatedExWorkStartDate = t.toISOString();
        switch (this.selectEstimatedExWorkDate) {
            case "1":
                this.estimatedExWorkEndDate = t.toISOString()
                t.setMonth(t.getMonth() - 1);
                this.estimatedExWorkStartDate = t.toISOString();
                break;
            case "2":
                t.setMonth(t.getMonth() + 3);
                this.estimatedExWorkEndDate = t.toISOString();
                break;
        }
    }
    changeShippingDate() {
        var t = new Date();
        this.shippingEndDate = t.toISOString();
        switch (this.selectShippingDate) {
            case "1":
                t.setMonth(t.getMonth() - 3);
                this.shippingStartDate = t.toISOString();
                break;
            case "2":
                t.setMonth(t.getMonth() - 6);
                this.shippingStartDate = t.toISOString();
                break;
        }
    }
}
