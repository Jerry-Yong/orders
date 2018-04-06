import { SharedModule } from './../../app/shared/shared.module';
import { FaqPage } from './faq';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    FaqPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(FaqPage),
  ],
})
export class FaqPageModule {}
