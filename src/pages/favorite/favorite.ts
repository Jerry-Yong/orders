
//  Page
import { FavoriteGroup } from './../../models/favorite-list.model';

//  Service
import { AppService } from './../../services/app.service';
import { FavoriteService } from './../../services/favorite.service';
import { StorageService } from './../../services/storage.service';

//  Module
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the FavoritePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-favorite',
    templateUrl: 'favorite.html',
})
export class FavoritePage {
    public keyword: string = "";
    public favoriteList: Array<FavoriteGroup> = [];
    public showSearchResult: boolean = false;
    public searchFavoriteList: Array<any>;
    constructor(
        public favoriteService: FavoriteService,
        public appService: AppService,
        public storageService: StorageService,
        public navCtrl: NavController,
        public navParams: NavParams
    ){
    }

    ionViewDidLoad(){
        this.loadData();
    }
    doRefresh(event){
        this.loadData().then(() => event.complete());
    }
    loadData(){
        return new Promise((resolve, reject) => {
            this.appService.showLoading();
            this.storageService.getSignInUser().then(signInUser => {
                this.favoriteService.getList(signInUser.Email).then(result => {
                    this.favoriteList = result;
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
    onInput(event){
        this.clearSearchResult();
        let keyword = event.target.value;
        if(keyword){
            this.favoriteList.forEach(group => {
                let items = group.Items.filter(function (item) {
                    return item.CustomerName.toLowerCase().indexOf(keyword.toLowerCase()) > -1 ||
                        (item.SalesOrderNumber && item.SalesOrderNumber.indexOf(keyword) > -1) ||
                        (item.SalesOrderItemNumber && item.SalesOrderItemNumber.toString().indexOf(keyword) > -1);
                });
                if(items.length > 0){
                    this.searchFavoriteList.push({ Type: group.Type, Items: items });
                }
            });
            this.showSearchResult = true;
        }
    }
    clearSearchResult() {
        this.showSearchResult = false;
        this.searchFavoriteList = [];
    }
}
