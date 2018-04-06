
export enum Environment {
    Debug,
    Deploment,
    Staging,
    Production
}
export class AppGlobal {

    private static instance: AppGlobal = new AppGlobal();
    environment: Environment = Environment.Staging;
    watchdogServer: string = "https://dev.api.cloudapps02.abb.com.cn/9aag024886";
    watchdogApplication: string = "9aag025529";
    watchdogApplicationPassword: string = "f0OXgQD7nPunFkoVI7h=";
    apiServer: string = "http://localhost:15856";
    apiClientID: string = "ec0d8088d68f4bda983f76c92c930db2";
    googleAnalyticsID: string = "UA-71248232-13";
    appVersionServer: string = "https://dev.cloudapps02.abb.com.cn/9aag025609";
    appVersionAppName: string = "ABBOrdersIAMA";
    installUrl: string = "https://dev.cloudapps02.abb.com.cn/9aag025529/install.html";
    constructor() {
        if (AppGlobal.instance) {
            throw new Error("错误: 请使用AppGlobal.getInstance() 代替使用new.");
        }
        AppGlobal.instance = this;

        switch (this.environment) {
            case Environment.Deploment:
                this.apiServer = "https://dev.cloudapps02.abb.com.cn/9aag025529";
                this.googleAnalyticsID = "UA-71248232-13";
                break;
            case Environment.Staging:
                this.watchdogServer = "https://test.api.cloudapps02.abb.com.cn/9aag024886";
                this.watchdogApplication = "9aag025529";
                this.watchdogApplicationPassword = "v04pKyFq=O8aXFzHk8Lm";
                this.apiServer = "https://test.cloudapps02.abb.com.cn/9aag025529";
                this.apiClientID = "46d5c8d81ab045e285ddd74736d511c6";
                this.googleAnalyticsID = "UA-71248232-13";
                this.appVersionServer = "https://test.cloudapps02.abb.com.cn/9aag025609";
                this.installUrl = "https://test.cloudapps02.abb.com.cn/9aag025529/install.html";
                break;
            case Environment.Production:
                this.watchdogServer = "https://api.cloudapps02.abb.com.cn/9aag024886";
                this.watchdogApplication = "9aag025529";
                this.watchdogApplicationPassword = "cHwqWi3IhtaTqiifOLNv";
                this.apiServer = "https://cloudapps02.abb.com.cn/9aag025529";
                this.apiClientID = "0f1b9167c71f4b7e8cfad7378d483041";
                this.googleAnalyticsID = "UA-71920079-36";
                this.appVersionServer = "https://cloudapps02.abb.com.cn/9aag025609";
                this.installUrl = "https://cloudapps02.abb.com.cn/9aag025529/install.html";
                break;
            default:
                break;
        }
    }

    public static getInstance(): AppGlobal {
        return AppGlobal.instance;
    }
}
