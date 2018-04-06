
//  Page
import { Favorite } from './../../models/favorite.model';
import { ScanResult } from './../../models/scan-result.model';
import { QuickSearchPage } from "../quick-search/quick-search";
import { CustomerDashboardPage } from "../customer-dashboard/customer-dashboard";
import { SalesOrderItemPage } from "../sales-order-item/sales-order-item";

//  Service
import { AppService } from './../../services/app.service';
import { FavoriteService } from './../../services/favorite.service';
import { QRCodeService } from './../../services/qrcode.service';
import { SalesOrderService } from './../../services/sales-order.service';
import { StorageService } from './../../services/storage.service';

//  Module
import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams, PopoverController } from 'ionic-angular';
/**
 * Generated class for the SalesOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-sales-order',
    templateUrl: 'sales-order.html',
})
export class SalesOrderPage {
    //Search
    key: string;
    keyword: string;
    orderBy: string = "CustomerName ASC";
    status: string = "";
    //List
    data: any = [];
    public hasMore: boolean = true;
    public start: number = 0;
    public count: number = 10;
    //Filter Data
    countryData: Array<any> = [];
    salesPersonData: Array<any> = [];
    salesPersonData_clone: any;
    countryPageData: Array<any> = [];
    salesPersonPageData: Array<any> = [];
    //Filter
    selectDate: string;
    createStartDate: string;
    createEndDate: string;
    customerName: string;
    country: Array<string> = [];
    salesPerson: Array<string> = [];
    constructor(
        public qrCodeService: QRCodeService,
        public appService: AppService,
        public storageService: StorageService,
        public favoriteService: FavoriteService,
        public salesOrderService: SalesOrderService,
        public popoverCtrl: PopoverController,
        public menuCtrl: MenuController,
        public navCtrl: NavController,
        public navParams: NavParams
    ){

    }
    ionViewDidLoad() {
        this.key = this.navParams.get("Key");
        this.keyword = this.navParams.get("Keyword");
        if(this.navParams.get("ScanResult")){
            let scanResult: ScanResult = this.navParams.get("ScanResult");
            if(scanResult.SalesOrderNumber){
                this.key = "SalesOrderNumber";
                this.keyword = scanResult.SalesOrderNumber;
            }else if (scanResult.PurchaseOrderNumber){
                this.key = "PurchaseOrderNumber";
                this.keyword = scanResult.PurchaseOrderNumber;
            }
        }
        this.loadData().then(data => this.loadFilterData());
    }
    ionViewDidEnter(){
        this.menuCtrl.enable(true, 'sales-filter');
    }
    loadData() {
        return new Promise((resolve, reject) => {
            this.appService.showLoading();
            Promise.all([this.storageService.getDeviceID(), this.storageService.getSignInUser()]).then(result => {
                let deviceID = result[0];
                let signInUser = result[1];
                let params = {
                    Key: this.key,
                    Keyword: this.keyword,
                    OrderBy: this.orderBy,
                    Status: this.status,
                    Start: this.start,
                    Count: this.count,
                    CreateStartDate: this.createStartDate,
                    CreateEndDate: this.createEndDate,
                    CustomerName: this.customerName,
                    Country: this.country,
                    SalesPerson: this.salesPerson,
                    DeviceID: deviceID,
                    CurrentUserEmail: signInUser ? signInUser.Email : ''
                };
                this.salesOrderService.getSalesOrderList(params).then(result => {
                    if(result.Data){
                        if(result.Data.length < this.count){
                            this.hasMore = false;
                        }
                        this.start = this.start + this.count;
                        this.data = this.data.concat(result.Data);
                        if(this.key && this.keyword){
                            this.storageService.addQuickSearchHistory(this.key, this.keyword);
                        }
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
    loadFilterData() {
        Promise.all([this.storageService.getDeviceID(), this.storageService.getSignInUser()]).then(result => {
            let deviceID = result[0];
            let signInUser = result[1];
            let params = {
                Key: this.key,
                Keyword: this.keyword,
                Status: this.status,
                DeviceID: deviceID,
                CurrentUserEmail: signInUser ? signInUser.Email : ''
            };
            this.salesOrderService.getSalesOrderCountryList(params).then(result => {
                if(result.Success){
                    this.countryData = result.Data;
                    this.countryPageData = this.appService.pagination(result.Data, 1, 9);
                }
            }).catch(error => {

            });
            this.salesOrderService.getSalesOrderSalesPersonList(params).then(result => {
                if(result.Success){
                    this.salesPersonData = result.Data;
                    this.salesPersonData_clone = this.clone(result.Data);
                    this.salesPersonPageData = this.appService.pagination(result.Data, 1, 9);
                }
            }).catch(error => {

            });
        });
    }
    doRefresh(event) {
        this.data = [];
        this.start = 0;
        this.count = 10;
        this.loadData().then(() => event.complete());
    }
    doInfinite(event){
        if(!this.hasMore){
            return;
        }
        this.loadData().then(data => event.complete());
    }
    openMenu() {
        this.menuCtrl.enable(true, "left");
        this.menuCtrl.toggle("left");
    }
    openSearch() {
        this.navCtrl.setRoot(QuickSearchPage);
    }
    toggleFilter() {
        this.menuCtrl.enable(true, "sales-filter");
        this.menuCtrl.toggle("sales-filter");
    }
    changeSalesOrderCreateDate(index){
        var t = new Date();
        this.createEndDate = t.toISOString();
        // this.selectDate = index;
        switch (this.selectDate){
            case "1":
                t.setMonth(t.getMonth() - 3);
                this.createStartDate = t.toISOString();
                break;
            case "2":
                t.setMonth(t.getMonth() - 6);
                this.createStartDate = t.toISOString();
                break;
            case "3":
                t.setMonth(t.getMonth() - 6);
                this.createEndDate = t.toISOString();
                t.setMonth(t.getMonth() - 12);
                this.createStartDate = t.toISOString();
                break;
            case "4":
                t.setMonth(t.getMonth() - 12);
                this.createStartDate = "";
                this.createEndDate = t.toISOString();
                break;
        }
        console.log("this.createStartDate:",this.createStartDate);
        console.log("this.createEndDate:",this.createEndDate);
    }
    openCustomerDashboard(customerCode) {
        this.navCtrl.push(CustomerDashboardPage, { CustomerCode: customerCode });
    }
    openSalesOrderItem(salesOrderNumber) {
        this.navCtrl.push(SalesOrderItemPage, { SalesOrderNumber: salesOrderNumber, isSignIn: true });
    }
    share(item) {
        let params: ScanResult = {
            SalesOrderNumber: item.SalesOrderNumber,
            PurchaseOrderNumber: item.PurchaseOrderNumber
        };
        this.qrCodeService.encode(JSON.stringify(params)).then(dataURL => {
            this.appService.drawQRCode(dataURL.toString(), item.SalesOrderNumber).then((canvas) => {
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
          if(item.IsFavorite){
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
                params.FavoriteType = 1;
                params.CustomerCode = item.CustomerCode;
                params.CustomerName = item.CustomerName;
                params.SalesOrderNumber = item.SalesOrderNumber;
                params.CreatedBy = signInUser.Email;
                this.favoriteService.add(params).then(result => {
                    if(result.Success){
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
    onChangeOrderBy(event) {
        this.data = [];
        this.start = 0;
        this.count = 10;
        this.loadData();
    }
    onChangeSortFilter(event) {
        this.data = [];
        this.start = 0;
        this.count = 10;
        this.loadData().then(data => this.loadFilterData());
    }
    resetFilter() {
        this.customerName = "";
        this.createStartDate = "";
        this.createEndDate = "";
        this.selectDate = "";
        this.country = [];
        this.salesPerson = [];
        this.countryData.forEach(element => {
            element.Checked = false;
        });
        this.countryPageData.forEach(element => {
            element.Checked = false;
        });
        this.salesPersonData.forEach(element => {
            element.Checked = false;
        });
        this.salesPersonPageData.forEach(element => {
            element.Checked = false;
        });
    }
    filter() {
        this.data = [];
        this.start = 0;
        this.count = 10;
        this.loadData().then(data => this.toggleFilter());
    }
    selectCountry() {
        this.menuCtrl.enable(true, "country-filter");
        this.menuCtrl.toggle("country-filter");
    }
    cancelCountry() {
        this.toggleFilter();
    }
    confirmCountry() {
        this.country = [];
        this.countryData.forEach(element => {
            if(element.Checked){
                this.country.push(element.Value);
            }
        });
        this.toggleFilter();
    }
    selectSalesPerson(){
        console.log("this.salesPersonData--Menu:",this.salesPersonData);
        console.log("this.salesPersonData_clone--Menu:",this.salesPersonData_clone);
        this.menuCtrl.enable(true, "sales-person-filter");
        this.menuCtrl.toggle("sales-person-filter");
    }
    cancelSalesPerson(){
        console.log("this.salesPersonData--Cancel:",this.salesPersonData);
        console.log("this.salesPersonData_clone--Cancel:",this.salesPersonData_clone);
        this.toggleFilter();
    }
    confirmSalesPerson(){
        this.salesPerson = [];
        this.salesPersonData.forEach(element => {
            if(element.Checked){
                this.salesPerson.push(element.Value);
            }
        });
        console.log("this.salesPersonData---Confirm:",this.salesPersonData);
        console.log("this.salesPersonData_clone---Confirm:",this.salesPersonData_clone);
        this.toggleFilter();
    }
    selectCountryCheckbox(item, index) {
        this.countryData[index].Checked = !item.Checked;
        //选中和移除
        if(item.Checked){
            this.country.push(item.Value);
        }else{
            this.country = this.country.filter(value => {
                return value != item.Value;
            })
        }
        //判断是否全部
        let seletCount = this.countryData.filter(item => {
            return item.Checked;
        }).length;
        if(seletCount == 0){
            this.salesPerson = [];
        }
    }
    selectSalesPersonCheckbox(item, index){
        this.salesPersonData[index].Checked = !item.Checked;
        //选中和移除
        if(item.Checked){
            this.salesPerson.push(item.Value);
        }else{
            this.salesPerson = this.salesPerson.filter(value => {
                return value != item.Value;
            })
        }
        //判断是否全部
        let seletCount = this.salesPersonData.filter(item => {
            return item.Checked;
        }).length;
        if(seletCount == 0){
            this.salesPerson = [];
        }
    }
    clone(obj){
        let json=JSON.stringify(obj);
        let newObj=JSON.parse(json);
        return newObj;
    }
}
