
// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the SqliteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SqliteServiceProvider {
    DB:any;
    database:SQLiteObject;
    email:string;
    deviceID:string;
    token:string;
    touchidEnable:string;
    loginPage:string;
    defaultPage:string;
    language:string;
    constructor(
        private sqliteSer:SQLite
    ){

    }
    createTable(callback){
        this.sqliteSer.create({
            name: 'iOrdersIAMA.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            console.log("db--31:",db);
            this.DB = db;
            db.executeSql('CREATE TABLE IF NOT EXISTS Token (email text,deviceID text,token text,touchidEnable text,loginPage text,defaultPage text,language text)',{}).then(() => {
                console.log('finished creating table');
                callback("Done");
            }).catch(error1 => {

            });
        }).catch(error2 => {

        });
    }
    save(email,deviceID,token,touchidEnable,loginPage,defaultPage,language){
        this.DB.transaction(tx => {
            console.log("tx:",tx);
            tx.executeSql("SELECT email,deviceID,token,touchidEnable,loginPage,defaultPage,language FROM Token where email=?",[email],function(tx,res){
                let touchidEanble = "";
                if(res.rows.length > 0){
                    touchidEanble = res.rows.item(0).touchidEnable;
                }
                tx.executeSql('delete from Token', []);
                tx.executeSql("INSERT INTO Token (email,deviceID,token,touchidEnable,loginPage,defaultPage,language) VALUES (?,?,?,?,?,?,?)",[email,deviceID,token,touchidEnable,loginPage,defaultPage,language],function(tx,res){

                },
                function(error){
                    console.log("插入失败：",error);
                });
            },function(error){
                console.log("error---60:",error);
            });
        });
    }
    get(callback){
        let data = {
            email:"",
            deviceID:"",
            token:"",
            touchidEnable:"",
            loginPage:"",
            defaultPage:"",
            language:""
        };
        this.sqliteSer.create({
            name: 'iOrdersIAMA.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            this.DB = db;
            this.DB.transaction( tx => {
                let query = "SELECT email,deviceID,token,touchidEnable,loginPage,defaultPage,language FROM Token";
                tx.executeSql(query,[],(tx,res) => {
                    if(res.rows.length > 0){
                        data.email = res.rows.item(0).email;
                        data.deviceID = res.rows.item(0).deviceID;
                        data.token = res.rows.item(0).token;
                        data.touchidEnable = res.rows.item(0).touchidEnable;
                        data.loginPage = res.rows.item(0).loginPage;
                        data.defaultPage = res.rows.item(0).defaultPage;
                        data.language = res.rows.item(0).language;
                        callback(data);
                    }else{
                        console.log("No results found");
                        callback(data);
                    }
                },function(err){
                    console.log("error--92:",err);
                });
            })
        })
    }
    upDateEnable(enable){
        console.log("enable:",enable);
        this.DB.transaction(tx => {
            let v = "false";
            if(enable == "true" || enable == true){
                v = "true";
            }
            tx.executeSql(" UPDATE Token SET touchidEnable=? ",[v],params => {
                console.log("update touchid enable successfully---106:",v);
            }, error => {
                console.log("error--106:",error);
            });
        })
    }
    upDateToken(token){
        this.DB.transaction(tx => {
            tx.executeSql(" UPDATE Token SET token=? ",[token],params => {
                console.log("update token successfully--115:",token);
            }, error => {
                console.log("error--115:",error);
            });
        })
    }
    upDateDefaultPage(defaultPage){
        this.DB.transaction(tx => {
            tx.executeSql(" UPDATE Token SET defaultPage=? ",[defaultPage],params => {
                console.log("update defaultPage successfully---124:",defaultPage);
            }, error => {
                console.log("error--115:",error);
            });
        })
    }
    upDateLanguage(language){
        this.DB.transaction(tx => {
            tx.executeSql(" UPDATE Token SET language=? ",[language],params => {
                console.log("update language successfully---124:",language);
            }, error => {
                console.log("error--115:",error);
            });
        })
    }
    delete(){
        this.DB.transaction( tx => {
            tx.executeSql("delete from Token");
            this.email = "";
            this.deviceID = "";
            this.token = "";
            this.touchidEnable = "";
            this.loginPage = "";
            this.defaultPage = "";
            this.language = "";
        });
    }

}
