
import { AppService } from './app.service';
import { QRCodeService } from './qrcode.service';
import { Injectable } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';

@Injectable()
export class BarcodeScannerService {

    constructor(
        public appService: AppService,
        public qrcodeService: QRCodeService,
        public camera: Camera,
        public barcodeScanner: BarcodeScanner,
        public actionSheetCtrl: ActionSheetController
    ) {

    }
    scan(): any {
        return new Promise((resolve, reject) => {
            Promise.all([this.appService.translate("TakePhoto").toPromise(),this.appService.translate("SeletFromLibrary").toPromise(),this.appService.translate("CancelButtonText").toPromise()]).then(result=>{
                let actionSheet = this.actionSheetCtrl.create({
                    buttons: [
                        {
                            text: result[0],
                            handler: () => {
                                let options: BarcodeScannerOptions = {
                                    preferFrontCamera: false,
                                    showFlipCameraButton: false,
                                    showTorchButton: false,
                                    resultDisplayDuration: 0,
                                    prompt: ""
                                };
                                this.barcodeScanner.scan(options)
                                    .then(function (barcodeData) {
                                        resolve(barcodeData);
                                    }, function (error) {
                                        reject(error);
                                    });
                            }
                        }, {
                            text: result[1],
                            handler: () => {
                                let options: CameraOptions = {
                                    destinationType: this.camera.DestinationType.DATA_URL,
                                    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
                                    mediaType: this.camera.MediaType.PICTURE
                                };
                                this.camera.getPicture(options).then((imageData) => {
                                    this.qrcodeService.decode(imageData).then(value => {
                                        resolve(value);
                                    }).catch(error => {
                                        reject(error);
                                    });
                                });
                            }
                        }, {
                            text: result[2],
                            role: 'cancel',
                            handler: () => {
                                return true;
                            }
                        }
                    ]
                });
                actionSheet.present();
            });
        });
    }
}
