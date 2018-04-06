
//  Page
import { SharedModule } from './../../app/shared/shared.module';
import { SignInPage } from './sign-in';
import { CheckVersionPopup } from "./checkVersionPopup/index";

//  Module
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [
        SignInPage,
        CheckVersionPopup,
    ],
    imports: [
        SharedModule,
        IonicPageModule.forChild(SignInPage),
    ],
})
export class SignInPageModule {}
