import { SharedModule } from './../../app/shared/shared.module';
import { SalesOrderItemPage } from './sales-order-item';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SalesOrderItemPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(SalesOrderItemPage),
  ],
})
export class SalesOrderItemPageModule {}
