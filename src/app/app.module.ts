
//  Page
import { MyApp } from './app.component';
import { CustomerSearchPageModule } from '../pages/customer-search/customer-search.module';
import { AboutPageModule } from './../pages/about/about.module';
import { CustomerDashboardPageModule } from './../pages/customer-dashboard/customer-dashboard.module';
import { CustomerSalesOrderPageModule } from './../pages/customer-sales-order/customer-sales-order.module';
import { FaqPageModule } from './../pages/faq/faq.module';
import { FavoritePageModule } from './../pages/favorite/favorite.module';
import { IntroductionPageModule } from './../pages/introduction/introduction.module';
import { MainPageModule } from './../pages/main/main.module';
import { QuickSearchPageModule } from './../pages/quick-search/quick-search.module';
import { SalesOrderItemDetailPageModule } from './../pages/sales-order-item-detail/sales-order-item-detail.module';
import { SalesOrderItemPageModule } from './../pages/sales-order-item/sales-order-item.module';
import { SalesOrderPageModule } from './../pages/sales-order/sales-order.module';
import { SettingPageModule } from './../pages/setting/setting.module';
import { SignInPageModule } from './../pages/sign-in/sign-in.module';

//  Service
import { BarcodeScannerService } from './../services/barcodescanner.service';
import { EncryptService } from './../services/encrypt.service';
import { FavoriteService } from './../services/favorite.service';
import { FingerprintService } from './../services/fingerprint.service';
import { QRCodeService } from './../services/qrcode.service';
import { SalesOrderService } from './../services/sales-order.service';
import { StorageService } from './../services/storage.service';
import { TokenService } from './../services/token.service';
import { UserService } from './../services/user.service';
import { VersionService } from './../services/version.service';
import { AppService } from '../services/app.service';
import { SqliteServiceProvider } from "../services/sqlite-service/sqlite-service";

//  Module
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
// import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { AppAvailability } from '@ionic-native/app-availability';
import { AppVersion } from '@ionic-native/app-version';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { Clipboard } from '@ionic-native/clipboard';
import { Device } from '@ionic-native/device';
import { Globalization } from '@ionic-native/globalization';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
// import { TouchID } from '@ionic-native/touch-id';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthConfig, AuthHttp, JwtHelper } from 'angular2-jwt';
import { QRCodeModule } from 'angular2-qrcode';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
// import { FingerprintAIO } from "@ionic-native/fingerprint-aio";
import { KeychainTouchId } from '@ionic-native/keychain-touch-id';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function authHttpServiceFactory(http: Http, options: RequestOptions, localStorage: StorageService, tokenService: TokenService) {
    let jwtHelper = new JwtHelper();
    let authConfig = new AuthConfig({
        globalHeaders: [{ 'Accept': 'application/json' }],
        tokenGetter: (() => {
            return new Promise((resolve, reject) => {
                localStorage.getToken().then(token => {
                    if(token && !jwtHelper.isTokenExpired(token)){
                        resolve(token);
                    }else{
                        tokenService.getToken().then(result => {
                            localStorage.setToken(result.access_token);
                            resolve(result.access_token);
                        }).catch(error => {
                            reject();
                        });
                    }
                }).catch(error => {
                    reject();
                });
            });
        }),
    });
    return new AuthHttp(authConfig, http, options);
}
@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        IonicStorageModule.forRoot(),
        IonicModule.forRoot(MyApp, {
            statusbarPadding: false,
            backButtonText: '',
            iconMode: 'ios',
            mode: 'ios',
            modalEnter: 'modal-slide-in',
            modalLeave: 'modal-slide-out',
            tabsPlacement: 'bottom',
            pageTransition: 'ios-transition'
        }),
        QRCodeModule,
        CustomerSearchPageModule,
        CustomerSalesOrderPageModule,
        AboutPageModule,
        SignInPageModule,
        MainPageModule,
        FavoritePageModule,
        QuickSearchPageModule,
        SettingPageModule,
        SalesOrderPageModule,
        SalesOrderItemPageModule,
        SalesOrderItemDetailPageModule,
        CustomerDashboardPageModule,
        IntroductionPageModule,
        FaqPageModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [
        SQLite,
        // TouchID,
        // AndroidFingerprintAuth,
        InAppBrowser,
        AppAvailability,
        AppVersion,
        Keyboard,
        Clipboard,
        StatusBar,
        SplashScreen,
        Camera,
        Device,
        SocialSharing,
        GoogleAnalytics,
        Globalization,
        BarcodeScanner,
        QRCodeService,
        BarcodeScannerService,
        AppService,
        VersionService,
        FavoriteService,
        StorageService,
        TokenService,
        FingerprintService,
        UserService,
        EncryptService,
        SalesOrderService,
        SqliteServiceProvider,
        // FingerprintAIO,
        KeychainTouchId,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions, StorageService, TokenService]
        }
    ]
})
export class AppModule { }
