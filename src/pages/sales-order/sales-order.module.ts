import { SharedModule } from './../../app/shared/shared.module';
import { ComponentsModule } from './../../components/components.module';
import { SalesOrderPage } from './sales-order';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SalesOrderPage
  ],
  imports: [
    SharedModule,
    ComponentsModule,
    IonicPageModule.forChild(SalesOrderPage),
  ],
})
export class SalesOrderPageModule {}
