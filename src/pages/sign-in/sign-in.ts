
//  Page
import { AppGlobal } from './../../app/app.global';
import { Setting } from './../../models/setting.model';
import { SignInUser } from './../../models/sign-in-user.model';
import { SignIn } from './../../models/sign-in.model';
import { MainPage } from "../main/main";
import { CheckVersionPopup } from "./checkVersionPopup/index";

//  Service
import { AppService } from './../../services/app.service';
import { FingerprintService } from './../../services/fingerprint.service';
import { StorageService } from './../../services/storage.service';
import { UserService } from './../../services/user.service';
import { SqliteServiceProvider } from "../../services/sqlite-service/sqlite-service";

//  Module
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
// import { FingerprintAIO } from "@ionic-native/fingerprint-aio";
import { KeychainTouchId } from '@ionic-native/keychain-touch-id';

/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-sign-in',
    templateUrl: 'sign-in.html',
})
export class SignInPage implements OnInit{

    @ViewChild('child')
    child: CheckVersionPopup;

    private touchIDEnable:any;
    private defaultLanguage:string = "en-US";
    private isCheckAppVersion:any;
    private defaultPage:string;
    public signInUser: SignInUser;
    public setting: Setting;
    public model: SignIn = new SignIn();
    constructor(
        public fingerprintService: FingerprintService,
        public userService: UserService,
        public appService: AppService,
        public storageService: StorageService,
        public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public sqliteSer: SqliteServiceProvider,
        // public faio:FingerprintAIO,
        public alertCtr:AlertController,
        private keychainTouchId: KeychainTouchId
    ){
        this.isCheckAppVersion = this.navParams.get("isCheckAppVersion");
        console.log("this.navParams:",this.navParams);
        this.platform.ready().then(() => {
            try{
                this.sqliteSer.get((sqData:any) => {
                    console.log("sqData--68:",sqData);
                    if(sqData.defaultPage){
                        this.defaultPage = sqData.defaultPage;
                    }else{
                        this.defaultPage = "QuickSearchPage";
                    }
                    if(sqData.language){
                        this.defaultLanguage = sqData.language;
                    }
                });
            }catch(error){
                console.log(error);
            }
        });
    }
    ngOnInit(){
        console.log("this.isCheckAppVersion:",this.isCheckAppVersion);
        if(!this.isCheckAppVersion || this.isCheckAppVersion == "false"){
            this.platform.ready().then( () => {
                this.child.checkVersion((data:any) => {
                    if(!data.Data.Update){
                        this.touchIDLogin();
                    }
                });
            });
        }
    }
    touchIDLogin(){
        this.platform.ready().then(() => {
            try{
                this.sqliteSer.get((sqData:any) => {
                    console.log("sqData--86:",sqData);
                    if(sqData.email){
                        this.model.Email = sqData.email;
                        if(sqData.deviceID && sqData.token){
                            this.touchIDEnable = sqData.touchidEnable;
                            if(sqData.touchidEnable == true || sqData.touchidEnable == "true"){
                                console.log(11);
                                this.keychainTouchId.isAvailable().then((res: any) => {
                                    console.log("res---22:",res);
                                    this.keychainTouchId.has(this.model.Email).then(res => {
                                        console.log("res---33:",res);
                                        this.appService.translate("Common.FingerprintTip").subscribe(mess => {
                                            this.keychainTouchId.verify(this.model.Email,mess).then((res:any) => {
                                                console.log("res---44:",res);
                                                this.appService.showLoading();
                                                this.userService.fingerprintSignIn(sqData.token, sqData.email, sqData.deviceID).then((data:any) => {
                                                    if(data.Success){
                                                        this.signSuccess(data,sqData.email,sqData.deviceID).then(() => {
                                                            console.log("signSuccess--106");
                                                            // this.navCtrl.setRoot("MainPage",{},{});
                                                            this.sqliteSer.save(sqData.email,sqData.deviceID,data.Token,true,"ABBLogin",this.defaultPage,this.defaultLanguage);
                                                            this.navCtrl.setRoot(MainPage, {}, {
                                                                animate: true,
                                                                direction: 'forward'
                                                            });
                                                        });
                                                    }else{
                                                        this.appService.translate("SignInPage.TokenExpired").subscribe(value => {
                                                            this.appService.alert(value);
                                                        });
                                                    }
                                                    this.appService.hideLoading();
                                                }).catch(error => {
                                                    this.appService.hideLoading();
                                                    this.appService.translate("TimeoutText").subscribe(value => {
                                                        this.appService.alert(value);
                                                    });
                                                });
                                            }).catch(error => {
                                                console.error("error--44:",error);
                                            });
                                        });
                                    }).catch(error => {
                                        console.error("error--33:",error);
                                    });
                                }).catch((error: any) => {
                                    console.error("error--22:",error);
                                });
                                //  start ...
                                /*
                                this.faio.isAvailable().then((res1:any) => {
                                    this.faio.show({
                                        clientId:"Fingerprint-Demo",
                                        clientSecret:'password',
                                        disableBackup:true,
                                        localizedFallbackTitle:'Use Pin',
                                        localizedReason:'TouchID login...'
                                    }).then(res => {
                                        this.appService.showLoading();
                                        this.userService.fingerprintSignIn(sqData.token, sqData.email, sqData.deviceID).then((data:any) => {
                                            if(data.Success){
                                                this.signSuccess(data,sqData.email,sqData.deviceID).then(() => {
                                                    console.log("signSuccess--106");
                                                    // this.navCtrl.setRoot("MainPage",{},{});
                                                    this.sqliteSer.save(sqData.email,sqData.deviceID,data.Token,true,"ABBLogin",this.defaultPage,this.defaultLanguage);
                                                    this.navCtrl.setRoot(MainPage, {}, {
                                                        animate: true,
                                                        direction: 'forward'
                                                    });
                                                });
                                            }else{
                                                this.appService.translate("SignInPage.TokenExpired").subscribe(value => {
                                                    this.appService.alert(value);
                                                });
                                            }
                                            this.appService.hideLoading();
                                        }).catch(error => {
                                            this.appService.hideLoading();
                                            this.appService.translate("TimeoutText").subscribe(value => {
                                                this.appService.alert(value);
                                            });
                                        });
                                    });
                                });
                                */
                                //  ... end


                            }
                        }
                    }
                });
            }catch(error){
                console.log(error);
            }
        });
    }
    ionViewDidLoad(){
        Promise.all([this.storageService.getSetting(), this.storageService.getSignInUser()]).then(result => {
            this.setting = result[0];
            this.signInUser = result[1];
            // if(this.setting.Language){
            //     this.defaultLanguage = this.setting.Language;
            // }
            if(this.signInUser){
                this.model.Email = this.signInUser.Email;
            }
            // console.log("result:",result);
            // if(this.signInUser && this.setting.TouchID == "true"){
            //     this.fingerprintService.authenticate().then(result => {
            //         this.fingerprintSignIn();
            //     }).catch(error => {
            //         console.log(error);
            //     });
            // }
        });
    }
    signIn(){
        //validation
        if(this.model.Email == '' || this.model.Email == undefined){
            this.appService.translate("SignInPage.EmailRequired").subscribe(value => {
                this.appService.alert(value);
            });
            return;
        }
        if(this.model.Password == '' || this.model.Password == undefined){
            this.appService.translate("SignInPage.PasswordRequired").subscribe(value => {
                this.appService.alert(value);
            });
            return;
        }
        this.model.Email = this.model.Email.trim();
        this.appService.showLoading();
        this.storageService.getDeviceID().then(deviceID => {
            this.userService.signIn(this.model.Email, this.model.Password, deviceID).then((data:any) => {
                if(data.Success){
                    this.signSuccess(data,this.model.Email,deviceID).then(() => {
                        this.platform.ready().then( () => {
                            try {
                                this.keychainTouchId.isAvailable().then((res: any) => {
                                    console.log("res---4:",res);
                                    this.appService.translate("SignInPage.EnableFingerprint").subscribe(value => {
                                        let alert = this.alertCtr.create({
                                            enableBackdropDismiss: false,
                                            message:value,
                                            buttons: [
                                                {
                                                    text: 'NO',
                                                    role: 'cancel',
                                                    handler: () => {
                                                        // console.log('不使用TouchID');
                                                        this.setting.TouchID = "false";
                                                        this.storageService.setSetting(this.setting);
                                                        this.sqliteSer.save(this.model.Email,deviceID,data.Token,false,"ABBLogin",this.defaultPage,this.defaultLanguage);
                                                        this.navCtrl.setRoot(MainPage, {}, {
                                                            animate: true,
                                                            direction: 'forward'
                                                        });
                                                    }
                                                },
                                                {
                                                    text: 'YES',
                                                    handler: () => {
                                                        try {
                                                            this.setting.TouchID = "true";
                                                            this.keychainTouchId.save(this.model.Email,this.model.Password).then((res:any) => {
                                                                console.log("res---5:",res);
                                                            }).catch(error => {
                                                                console.error("error--5:",error);
                                                            });
                                                            this.storageService.setSetting(this.setting);
                                                            this.sqliteSer.save(this.model.Email,deviceID,data.Token,true,"ABBLogin",this.defaultPage,this.defaultLanguage);
                                                            this.navCtrl.setRoot(MainPage, {}, {
                                                                animate: true,
                                                                direction: 'forward'
                                                            });
                                                        }catch (error) {
                                                            console.log("error2:",error);
                                                        }
                                                    }
                                                }
                                            ]
                                        });
                                        alert.present();
                                    });
                                }).catch((error: any) => {
                                    console.error("error--4:",error);
                                    this.setting.TouchID = "false";
                                    this.storageService.setSetting(this.setting);
                                    this.sqliteSer.save(this.model.Email,deviceID,data.Token,false,"ABBLogin",this.defaultPage,this.defaultLanguage);
                                    this.navCtrl.setRoot(MainPage, {}, {
                                        animate: true,
                                        direction: 'forward'
                                    });
                                });

                                //  start ...
                                /*
                                this.faio.isAvailable().then((res1:any) => {
                                    console.log(4);

                                    let alert = this.alertCtr.create({
                                        enableBackdropDismiss: false,
                                        message:"是否开启指纹啊？",
                                        buttons: [
                                            {
                                                text: 'NO',
                                                role: 'cancel',
                                                handler: () => {
                                                    // console.log('不使用TouchID');
                                                    this.setting.TouchID = "false";
                                                    console.log("false");
                                                    this.storageService.setSetting(this.setting);
                                                    this.sqliteSer.save(this.model.Email,deviceID,data.Token,false,"ABBLogin",this.defaultPage,this.defaultLanguage);
                                                    this.navCtrl.setRoot(MainPage, {}, {
                                                        animate: true,
                                                        direction: 'forward'
                                                    });
                                                }
                                            },
                                            {
                                                text: 'YES',
                                                handler: () => {
                                                    try {
                                                        this.setting.TouchID = "true";
                                                        this.storageService.setSetting(this.setting);
                                                        this.sqliteSer.save(this.model.Email,deviceID,data.Token,true,"ABBLogin",this.defaultPage,this.defaultLanguage);
                                                        this.navCtrl.setRoot(MainPage, {}, {
                                                            animate: true,
                                                            direction: 'forward'
                                                        });
                                                    }catch (error) {
                                                        console.log("error2:",error);
                                                    }
                                                }
                                            }
                                        ]
                                    });
                                    alert.present();
                                }).catch(() => {
                                    console.log(5);
                                    this.setting.TouchID = "false";
                                    this.storageService.setSetting(this.setting);
                                    this.sqliteSer.save(this.model.Email,deviceID,data.Token,false,"ABBLogin",this.defaultPage,this.defaultLanguage);
                                    this.navCtrl.setRoot(MainPage, {}, {
                                        animate: true,
                                        direction: 'forward'
                                    });
                                });
                                */
                                //  ... end

                            }catch(error){
                                console.log(6);
                                this.setting.TouchID = "false";
                                this.storageService.setSetting(this.setting);
                                this.sqliteSer.save(this.model.Email,deviceID,data.Token,false,"ABBLogin",this.defaultPage,this.defaultLanguage);
                                this.navCtrl.setRoot(MainPage, {}, {
                                    animate: true,
                                    direction: 'forward'
                                });
                            }
                        });
                        // this.fingerprintService.isAvailable().then(result => {
                        //     // if(this.touchIDEnable != "true" || !this.touchIDEnable){
                        //         Promise.all([
                        //             this.appService.translate("SignInPage.EnableFingerprint").toPromise(),
                        //             this.appService.translate("CancelButtonText").toPromise(),
                        //             this.appService.translate("YesButtonText").toPromise()
                        //         ]).then(result => {
                        //             this.appService.alertCtrl.create({
                        //                 message: result[0],
                        //                 enableBackdropDismiss: false,
                        //                 buttons: [
                        //                     {
                        //                         text: result[1],
                        //                         role: 'cancel',
                        //                         handler: () => {
                        //                             this.setting.TouchID = "false";
                        //                             console.log("false");
                        //                             this.storageService.setSetting(this.setting);
                        //                             this.sqliteSer.save(this.model.Email,deviceID,data.Token,false,"ABBLogin",this.defaultPage,this.defaultLanguage);
                        //                             this.navCtrl.setRoot(MainPage, {}, {
                        //                                 animate: true,
                        //                                 direction: 'forward'
                        //                             });
                        //                         }
                        //                     },
                        //                     {
                        //                         text: result[2],
                        //                         handler: () => {
                        //                             this.setting.TouchID = "true";
                        //                             console.log("true");
                        //                             this.storageService.setSetting(this.setting);
                        //                             this.sqliteSer.save(this.model.Email,deviceID,data.Token,true,"ABBLogin",this.defaultPage,this.defaultLanguage);
                        //                             this.navCtrl.setRoot(MainPage, {}, {
                        //                                 animate: true,
                        //                                 direction: 'forward'
                        //                             });
                        //                         }
                        //                     }
                        //                 ]
                        //             }).present();
                        //         });
                        //     // }else{
                        //     //
                        //     // }
                        // }).catch(error => {
                        //     this.navCtrl.setRoot(MainPage, {}, {
                        //         animate: true,
                        //         direction: 'forward'
                        //     });
                        // });
                    });
                }else{
                    this.appService.translate("SignInPage.SignInFailed").subscribe(value => {
                        this.appService.alert(value);
                    });
                }
                this.appService.hideLoading();
            }).catch(error => {
                console.log(error);
                this.appService.hideLoading();
                this.appService.translate("TimeoutText").subscribe(value => {
                    this.appService.alert(value);
                });
            });
        }).catch(error => {
            console.log(error);
        });
    }
    fingerprintSignIn() {
        this.appService.showLoading();
        this.storageService.getDeviceID().then(deviceID => {
            this.userService.fingerprintSignIn(this.signInUser.Token, this.model.Email, deviceID).then(result => {
                if(result.Success){
                    this.signSuccess(result,this.model.Email,deviceID).then(() => {
                        console.log("signSuccess--106");
                        // this.navCtrl.setRoot("MainPage",{},{});
                        this.sqliteSer.save(this.model.Email,deviceID,result.Token,true,"ABBLogin",this.defaultPage,this.defaultLanguage);
                        this.navCtrl.setRoot(MainPage, {}, {
                            animate: true,
                            direction: 'forward'
                        });
                    });
                }else{
                    this.appService.translate("SignInPage.TokenExpired").subscribe(value => {
                        this.appService.alert(value);
                    });
                }
                this.appService.hideLoading();
            }).catch(error => {
                this.appService.hideLoading();
                this.appService.translate("TimeoutText").subscribe(value => {
                    this.appService.alert(value);
                });
            });
        });
    }
    signSuccess(data,email,deviceID){
        return new Promise((resolve, reject) => {
            this.signInUser = new SignInUser();
            this.signInUser.Email = data.Email;
            this.signInUser.DisplayName = data.DisplayName;
            this.signInUser.Token = data.Token;
            this.signInUser.Avatar = AppGlobal.getInstance().apiServer + "/api/User/Avatar/" + data.Email;
            this.storageService.setSignInUser(this.signInUser);
            this.storageService.setIsSignIn(true);
            resolve();
            // this.fingerprintService.isAvailable().then(result => {
            //     // if(this.setting.TouchID == ""){
            //     if(this.touchIDEnable != "true" || !this.touchIDEnable){
            //         Promise.all([
            //             this.appService.translate("SignInPage.EnableFingerprint").toPromise(),
            //             this.appService.translate("CancelButtonText").toPromise(),
            //             this.appService.translate("YesButtonText").toPromise()
            //         ]).then(result => {
            //             this.appService.alertCtrl.create({
            //                 message: result[0],
            //                 buttons: [
            //                     {
            //                         text: result[1],
            //                         role: 'cancel',
            //                         handler: () => {
            //                             this.setting.TouchID = "false";
            //                             console.log("false");
            //                             this.storageService.setSetting(this.setting);
            //                             this.sqliteSer.save(email,deviceID,data.Token,false,"ABBLogin","QuickSearchPage","en-US");
            //                             resolve();
            //                         }
            //                     },
            //                     {
            //                         text: result[2],
            //                         handler: () => {
            //                             this.setting.TouchID = "true";
            //                             console.log("true");
            //                             this.storageService.setSetting(this.setting);
            //                             this.sqliteSer.save(email,deviceID,data.Token,true,"ABBLogin","QuickSearchPage","en-US");
            //                             resolve();
            //                         }
            //                     }
            //                 ]
            //             }).present();
            //         });
            //     }else{
            //         resolve();
            //     }
            // }).catch(error => {
            //     resolve();
            // });
        });
    }
}
