import { SharedModule } from './../../app/shared/shared.module';
import { SalesOrderItemDetailPage } from './sales-order-item-detail';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SalesOrderItemDetailPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(SalesOrderItemDetailPage),
  ],
})
export class SalesOrderItemDetailPageModule {}
