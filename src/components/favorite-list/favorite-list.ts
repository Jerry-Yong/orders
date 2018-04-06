
//  Page
import { FavoriteGroup } from './../../models/favorite-list.model';
import { CustomerDashboardPage } from "../../pages/customer-dashboard/customer-dashboard";
import { SalesOrderItemPage } from "../../pages/sales-order-item/sales-order-item";
import { SalesOrderItemDetailPage } from "../../pages/sales-order-item-detail/sales-order-item-detail";

//  Service
import { AppService } from './../../services/app.service';
import { FavoriteService } from './../../services/favorite.service';

//  Module
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the FavoriteListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'favorite-list',
    templateUrl: 'favorite-list.html'
})
export class FavoriteListComponent {
    @Input('data') data: Array<FavoriteGroup> = [];
    showCustomer: boolean = false;
    showSalesOrder: boolean = false;
    showSalesOrderItem: boolean = false;
    constructor(
        public favoriteService: FavoriteService,
        public appService: AppService,
        public navCtrl: NavController
    ){
        // this.data.forEach(group => {
        //     group.Expaned = groupType == group.Type && group.Expaned != true;
        // });
        console.log("this.data:",this.data);
    }
    toggleGroup(groupType: number) {
        this.data.forEach(group => {
            group.Expaned = groupType == group.Type && group.Expaned != true;
        });
    }
    openPage(item) {
        switch (item.FavoriteType) {
            case 0:
                this.navCtrl.push(CustomerDashboardPage, { CustomerCode: item.CustomerCode });
                break;
            case 1:
                this.navCtrl.push(SalesOrderItemPage, { SalesOrderNumber: item.SalesOrderNumber, isSignIn: true });
                break;
            case 2:
                this.navCtrl.push(SalesOrderItemDetailPage, { SalesOrderNumber: item.SalesOrderNumber, SalesOrderItemNumber: item.SalesOrderItemNumber });
                break;
            default:
                break;
        }
    }
    deleteFavorite(groupIndex, itemIndex, item) {
        this.appService.showLoading();
        this.favoriteService.delete(item.ID).then(result => {
            if(result.Success){
                this.appService.translate("Common.DeleteFavoriteSuccess").subscribe(value => {
                    this.appService.toast(value);
                });
                this.data[groupIndex].Items.splice(itemIndex, 1);
            }
            this.appService.hideLoading();
        }).catch(error => {
            this.appService.translate("Common.DeleteFavoriteFailed").subscribe(value => {
                this.appService.toast(value);
            });
            this.appService.hideLoading();
        });
    }
}
