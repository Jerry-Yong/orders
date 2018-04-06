
//  Page
import { MainPage } from './main';
import { SharedModule } from '../../app/shared/shared.module';

//  Module
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [
        MainPage,
    ],
    imports: [
        SharedModule,
        IonicPageModule.forChild(MainPage),
    ],
})
export class MainPageModule {}
