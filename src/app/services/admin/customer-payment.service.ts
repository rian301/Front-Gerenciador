import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CustomerPaymentModel } from "src/app/models/customer-payment.model";
import { environment } from "src/environments/environment";

@Injectable()
export class CustomerPaymentService {
    private endpoint: string = "customers";

    constructor(
        private http: HttpClient
    ) { }

    findPaymentByCustomer(id: number): Observable<CustomerPaymentModel[]> {
        return this.http.get<CustomerPaymentModel[]>(`${environment.urlApiResource}/${this.endpoint}/${id}/payment`);
    }

    findPaymendByCustomerById(customerId: number, id: number): Observable<CustomerPaymentModel[]> {
        return this.http.get<CustomerPaymentModel[]>(`${environment.urlApiResource}/${this.endpoint}/${customerId}/payment/${id}`);
    }

    save(model: CustomerPaymentModel): Observable<CustomerPaymentModel> {
        if (model.id != null && model.id > 0)
            return this.put(model.id, model);
        else
            return this.post(model);
    }

    put(id: number, model: CustomerPaymentModel): Observable<CustomerPaymentModel> {
        return this.http.put<CustomerPaymentModel>(`${environment.urlApiResource}/${this.endpoint}/${model.customerId}/payment/${id}`, model);
    }

    post(model: CustomerPaymentModel): Observable<CustomerPaymentModel> {
        return this.http.post<CustomerPaymentModel>(`${environment.urlApiResource}/${this.endpoint}/${model.customerId}/payment/`, model);
    }

    remove(id: number, customerId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.urlApiResource}/${this.endpoint}/${customerId}/payment/${id}`);
    }

}