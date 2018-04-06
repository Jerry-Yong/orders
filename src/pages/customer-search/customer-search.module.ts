
//  Page
import { SharedModule } from './../../app/shared/shared.module';
import { ComponentsModule } from './../../components/components.module';
import { CustomerSearchPage } from './customer-search';
import { CheckVersionPopup } from "./checkVersionPopup/index";

//  Module
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
    declarations: [
        CustomerSearchPage,
        CheckVersionPopup,
    ],
    imports: [
        SharedModule,
        ComponentsModule,
        IonicPageModule.forChild(CustomerSearchPage)
    ],
})
export class CustomerSearchPageModule {

}
