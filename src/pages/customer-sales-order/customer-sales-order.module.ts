import { CustomerSalesOrderPage } from './customer-sales-order';
import { SharedModule } from '../../app/shared/shared.module';
import { ComponentsModule } from '../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    CustomerSalesOrderPage,
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(CustomerSalesOrderPage),
  ],
})
export class CustomerSalesOrderPageModule {}
