
import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

declare let qrcode;
@Injectable()
export class QRCodeService {
    constructor() {

    }
    encode(data: string) {
        return new Promise((resolve, reject) => {
            let options = {
                version:10,
                errorCorrectionLevel: 'M',
                type: 'image/jpeg',
                rendererOpts: {
                    quality: 1
                }
            };
            QRCode.toDataURL(data, options, function (error, dataURL) {
                resolve(dataURL);
            });
        });
    }
    decode(base64string: string) {
        return new Promise((resolve, reject) => {
            qrcode.callback = (value) => {
                let result = { cancelled: false, text: value };
                resolve(result);
            };
            qrcode.decode('data:image/jpeg;base64,' + base64string);
        });
    }
}
