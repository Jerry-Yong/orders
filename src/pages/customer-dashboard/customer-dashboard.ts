
//  Page
import { Favorite } from './../../models/favorite.model';
import { ScanResult } from './../../models/scan-result.model';
import { CustomerSalesOrderPage } from "../customer-sales-order/customer-sales-order";

//  Service
import { AppService } from './../../services/app.service';
import { FavoriteService } from './../../services/favorite.service';
import { QRCodeService } from './../../services/qrcode.service';
import { SalesOrderService } from './../../services/sales-order.service';
import { StorageService } from './../../services/storage.service';
import { BingMapsLoader } from '../../services/bing-maps-loader.service';

//  Module
import { Component, transition } from '@angular/core';
import { ActionSheetController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import * as moment from 'moment';
declare let Microsoft;
/**
 * Generated class for the CustomerDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-customer-dashboard',
    templateUrl: 'customer-dashboard.html',
})
export class CustomerDashboardPage {
    customerCode: string;
    data: any = {};
    dataOrderReport;
    map: any;
    mapReady: boolean = false;
    constructor(
        public actionSheetCtrl: ActionSheetController,
        public qrCodeService: QRCodeService,
        public salesOrderService: SalesOrderService,
        public storageService: StorageService,
        public favoriteService: FavoriteService,
        public appService: AppService,
        public menuCtrl: MenuController,
        public navCtrl: NavController,
        public navParams: NavParams
    ){

    }
    ionViewDidLoad(){
        this.customerCode = this.navParams.get("CustomerCode");
        if (this.navParams.get("ScanResult")) {
            let scanResult: ScanResult = this.navParams.get("ScanResult");
            this.customerCode = scanResult.CustomerCode;
        }
        this.loadData();
    }
    loadData(){
        return new Promise((resolve, reject) => {
            this.appService.showLoading();
            Promise.all([this.storageService.getDeviceID(), this.storageService.getSignInUser()]).then(result => {
                let deviceID = result[0];
                let signInUser = result[1];
                this.salesOrderService.getCustomerDashboard(this.customerCode, deviceID, signInUser.Email).then(result => {
                    if (result.Success) {
                        this.data = result.Data;
                    }
                    this.loadMap();
                    this.appService.hideLoading();
                    resolve();
                }).catch(error => {
                    this.appService.hideLoading();
                    this.appService.translate("TimeoutText").subscribe(value => {
                        this.appService.alert(value);
                    });
                    reject();
                });
                this.salesOrderService.getCustomerDashboardOrderReport(this.customerCode, deviceID, signInUser.Email).then(result => {
                    if (result.Success) {
                        this.dataOrderReport = result.Data;
                    }
                }).catch(error => {

                });
            });
        });
    }
    loadMap(){
        try {
            BingMapsLoader.load().then(res => {
                if(this.map == undefined){
                    let mapElement = document.getElementById('map');
                    if(mapElement){
                        this.map = new Microsoft.Maps.Map(mapElement, {
                            credentials: 'AgD1ycXNVO7GBlCJzR2ufvtK-LV6TKffm1M8_Yn5nME_-Fd1c90CFwVnNq8A3AaV',
                            zoom: 18,
                            navigationBarMode: Microsoft.Maps.NavigationBarMode.minified,
                            showDashboard: false,
                            disablePanning: true,
                            navigationBarOrientation: Microsoft.Maps.NavigationBarOrientation.horizontal
                        });
                    }
                }
                if(this.map){
                    let location = new Microsoft.Maps.Location(this.data.Latitude, this.data.Longitude);
                    this.map.setView({
                        center: location
                    });
                    this.map.entities.clear();
                    if(!(this.data.Latitude == 0 && this.data.Longitude == 0)){
                        let pin = new Microsoft.Maps.Pushpin(location, {
                            title: this.data.CustomerName
                        });
                        this.map.entities.push(pin);
                    }
                }
            });
        }catch(error){
            this.appService.translate("CustomerDashboardPage.LoadMapFailed").subscribe(value => {
                this.appService.toast(error);
            });
        }
    }
    navigation(){
        if(this.data.CustomerAddress == '' || this.data.CustomerAddress == undefined){
            this.appService.translate("CustomerDashboardPage.LoadCustomerDashboardFailedForNavigation").subscribe(value => {
                this.appService.toast(value);
            });
            return false;
        }
        Promise.all([this.appService.translate("CustomerDashboardPage.StartBaiduMap").toPromise(), this.appService.translate("CustomerDashboardPage.StartAMap").toPromise(), this.appService.translate("CustomerDashboardPage.StartGoogleMap").toPromise(), this.appService.translate("CancelButtonText").toPromise()]).then(result => {
            let actionSheet = this.actionSheetCtrl.create({
                buttons: [
                    {
                        text: result[0],
                        handler: () => {
                            this.appService.copyToClipboard(this.data.CustomerAddress);
                            this.appService.openBaiduMap().catch(error => {
                                this.appService.translate("CustomerDashboardPage.StartBaiduMapError").subscribe(value => {
                                    this.appService.toast(value);
                                });
                            });
                        }
                    },
                    {
                        text: result[1],
                        handler: () => {
                            this.appService.copyToClipboard(this.data.CustomerAddress);
                            this.appService.openAMap().catch(error => {
                                this.appService.translate("CustomerDashboardPage.StartAMapError").subscribe(value => {
                                    this.appService.toast(value);
                                });
                            });
                        }
                    }, {
                        text: result[2],
                        handler: () => {
                            this.appService.copyToClipboard(this.data.CustomerAddress);
                            this.appService.openGoogleMap().catch(error => {
                                this.appService.translate("CustomerDashboardPage.StartGoogleMapError").subscribe(value => {
                                    this.appService.toast(value);
                                });
                            });
                        }
                    }, {
                        text: result[3],
                        role: 'cancel',
                        handler: () => {
                            return true;
                        }
                    }
                ]
            });
            actionSheet.present();
        });
    }
    openSalesOrderList(key) {
        this.navCtrl.push(CustomerSalesOrderPage, { CustomerCode: this.customerCode, Key: key });
    }
    doRefresh(event) {
        this.loadData().then(() => event.complete());
    }
    openMenu() {
        this.menuCtrl.enable(true, "left");
        this.menuCtrl.toggle("left");
    }
    share(item){
        let params: ScanResult = {
            CustomerCode: item.CustomerCode
        };
        this.qrCodeService.encode(JSON.stringify(params)).then(dataURL => {
            this.appService.drawQRCode(dataURL.toString(), item.CustomerCode).then((canvas) => {
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
    favorite(item) {
        this.storageService.getSignInUser().then(signInUser => {
            if(item.IsFavorite){
                this.appService.showLoading();
                this.favoriteService.delete(item.FavoriteID).then(result => {
                    if (result.Success) {
                        this.appService.translate("Common.DeleteFavoriteSuccess").subscribe(value => {
                            this.appService.toast(value);
                        });
                        this.data.IsFavorite = false;
                    }
                    this.appService.hideLoading();
                }).catch(error => {
                  this.appService.translate("Common.DeleteFavoriteFailed").subscribe(value => {
                      this.appService.toast(value);
                  });
                  this.appService.hideLoading();
                });
            }else{
                if(this.data.CustomerName == '' || this.data.CustomerName == undefined){
                    this.appService.translate("CustomerDashboardPage.LoadCustomerDashboardFailedForFavorite").subscribe(value => {
                        this.appService.toast(value);
                    });
                    return false;
                }
                let params = new Favorite();
                params.FavoriteType = 0;
                params.CustomerCode = item.CustomerCode;
                params.CustomerName = item.CustomerName;
                params.CreatedBy = signInUser.Email;
                this.appService.showLoading();
                this.favoriteService.add(params).then(result => {
                    if(result.Success){
                        this.appService.translate("Common.AddFavoriteSuccess").subscribe(value => {
                            this.appService.toast(value);
                        });
                        this.data.IsFavorite = true;
                        this.data.FavoriteID = result.Data;
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
    formatDate(value: string) {
        if(!value || value.length === 0){
            return '';
        }
        return moment(value).format('YYYY-MM-DD');
    }
}
