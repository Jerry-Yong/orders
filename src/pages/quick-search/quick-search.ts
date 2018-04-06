
//  Page
import { ScanResult } from './../../models/scan-result.model';
import { SalesOrderPage } from "../sales-order/sales-order";
import { SalesOrderItemDetailPage } from "../sales-order-item-detail/sales-order-item-detail";
import { SalesOrderItemPage } from "../sales-order-item/sales-order-item";
import { CustomerDashboardPage } from "../customer-dashboard/customer-dashboard";

//  Service
import { AppService } from './../../services/app.service';
import { BarcodeScannerService } from './../../services/barcodescanner.service';
import { StorageService } from './../../services/storage.service';

//  Module
import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, TextInput } from 'ionic-angular';

/**
 * Generated class for the QuickSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-quick-search',
    templateUrl: 'quick-search.html',
})
export class QuickSearchPage {
    history: any;
    historyKey: string;
    customerName: string;
    salesPerson: string;
    purchaseOrderNumber: string;
    salesOrderNumber: string;
    constructor(
        public appService: AppService,
        public storageService: StorageService,
        public barcodeScannerService: BarcodeScannerService,
        public navCtrl: NavController,
        public navParams: NavParams
    ){
    }

    ionViewDidLoad() {

    }
    openScan() {
        this.barcodeScannerService.scan().then(result => {
            if(result.cancelled){
                return false;
            }
            try{
                let scanResult: ScanResult = JSON.parse(result.text);
                if(scanResult.SalesOrderNumber && scanResult.SalesOrderItemNumber){
                    this.navCtrl.push(SalesOrderItemDetailPage, { ScanResult: scanResult });
                }else if(scanResult.SalesOrderNumber){
                    this.navCtrl.push(SalesOrderItemPage, { ScanResult: scanResult });
                }else if(scanResult.CustomerCode) {
                    this.navCtrl.push(CustomerDashboardPage, { ScanResult: scanResult });
                }else if(scanResult.PurchaseOrderNumber){
                    this.navCtrl.push(SalesOrderPage, { ScanResult: scanResult });
                }
            }catch(error){
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
    onFocusInput(event: TextInput) {
        this.historyKey = event._native.nativeElement.name;
        this.storageService.getQuickSearchHistory(this.historyKey).then(history => {
            this.history = history;
        });
    }
    search(event, key) {
        let keyword;
        switch (key) {
            case "CustomerName":
                keyword = this.customerName;
                break;
            case "SalesPerson":
                keyword = this.salesPerson;
                break;
            case "PurchaseOrderNumber":
                keyword = this.purchaseOrderNumber;
                break;
            case "SalesOrderNumber":
                keyword = this.salesOrderNumber;
                break;
        }
        if(keyword == "" || keyword == undefined){
            this.appService.translate(`QuickSearchPage.${key}Required`).subscribe(value => {
                this.appService.alert(value);
            });
            return;
        }
        keyword = keyword.trim();
        // this.navCtrl.push("SalesOrderPage", { Key: key, Keyword: keyword });
        this.navCtrl.push(SalesOrderPage, { Key: key, Keyword: keyword });
    }
    openHistoryRecord(keyword) {
        // this.navCtrl.push("SalesOrderPage", { Key: this.historyKey, Keyword: keyword });
        this.navCtrl.push(SalesOrderPage, { Key: this.historyKey, Keyword: keyword });
    }
    clearHistory() {
        this.history = [];
        this.storageService.setQuickSearchHistory(this.historyKey, this.history);
    }
}
