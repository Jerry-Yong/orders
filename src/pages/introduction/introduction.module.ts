import { SharedModule } from './../../app/shared/shared.module';
import { IntroductionPage } from './introduction';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    IntroductionPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(IntroductionPage),
  ],
})
export class IntroductionPageModule {}
