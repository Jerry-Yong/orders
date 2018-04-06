import { SharedModule } from './../../app/shared/shared.module';
import { SettingPage } from './setting';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    SettingPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(SettingPage)
  ],
})
export class SettingPageModule {}
