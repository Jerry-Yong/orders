
import { AppGlobal } from './../app/app.global';
import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';

@Injectable()
export class SalesOrderService {
    constructor(private http: AuthHttp) {

    }
    getCustomerDashboard(customerCode: string, deviceID: string, currentUserEmail: string) {
        let body = `CustomerCode=${customerCode}&DeviceID=${deviceID}&CurrentUserEmail=${currentUserEmail}`;
        return this.http.get(`${AppGlobal.getInstance().apiServer}/api/CustomerDashboard?${body}`)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }
    getCustomerDashboardOrderReport(customerCode: string, deviceID: string, currentUserEmail: string) {
        let body = `CustomerCode=${customerCode}&DeviceID=${deviceID}&CurrentUserEmail=${currentUserEmail}`;
        return this.http.get(`${AppGlobal.getInstance().apiServer}/api/CustomerDashboardOrderReport?${body}`)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }
    getCustomerSalesOrderList(body: any) {
        return this.http.post(`${AppGlobal.getInstance().apiServer}/api/CustomerSalesOrder`, body)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }
    getCustomerSalesOrderCountryList(body: any) {
        return this.http.post(`${AppGlobal.getInstance().apiServer}/api/CustomerSalesOrderCountryList`, body)
            .toPromise()
            .then(res => res.json());
    }
    getCustomerSalesOrderSalesPersonList(body: any) {
        return this.http.post(`${AppGlobal.getInstance().apiServer}/api/CustomerSalesOrderSalesPersonList`, body)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }
    getSalesOrderList(body: any) {
        return this.http.post(`${AppGlobal.getInstance().apiServer}/api/SalesOrder`, body)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }

    getSalesOrderItemList(body: any) {
        return this.http.post(`${AppGlobal.getInstance().apiServer}/api/SalesOrderItem`, body)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }

    getSalesOrderItemDetail(body: any) {
        return this.http.post(`${AppGlobal.getInstance().apiServer}/api/SalesOrderItemDetail`, body)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }
    getSalesOrderCountryList(body: any) {
        return this.http.post(`${AppGlobal.getInstance().apiServer}/api/SalesOrderCountryList`, body)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }
    getSalesOrderSalesPersonList(body: any) {
        return this.http.post(`${AppGlobal.getInstance().apiServer}/api/SalesOrderSalesPersonList`, body)
            .timeout(15000)
            .toPromise()
            .then(res => res.json());
    }

}
