import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
    imports: [
        QRCodeModule,
        TranslateModule
    ],
    exports: [
        QRCodeModule,
        TranslateModule
    ]
})

export class SharedModule {
}