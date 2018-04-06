
//  Page
import { SharedModule } from './../../app/shared/shared.module';
import { CustomerDashboardPage } from './customer-dashboard';

//  Module
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [
        CustomerDashboardPage,
    ],
    imports: [
        SharedModule,
        IonicPageModule.forChild(CustomerDashboardPage),
    ],
})
export class CustomerDashboardPageModule {}
