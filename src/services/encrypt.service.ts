
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptService {
    constructor() { }
    Encrypt(value: string): string {
        let dataBytes = CryptoJS.enc.Utf8.parse(value);
        let pwdBytes = CryptoJS.enc.Utf8.parse("11145678901234567890123456789012");
        let iv = CryptoJS.enc.Utf8.parse("0102030405060708");
        let encrypted = CryptoJS.AES.encrypt(dataBytes, pwdBytes,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        return encrypted.toString();
    }
}
