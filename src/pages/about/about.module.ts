import { SharedModule } from './../../app/shared/shared.module';
import { AboutPage } from './about';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    SharedModule,
    IonicPageModule.forChild(AboutPage),
  ],
})
export class AboutPageModule {}
