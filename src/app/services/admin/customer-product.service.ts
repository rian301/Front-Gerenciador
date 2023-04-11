import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CustomerProductModel } from "src/app/models/customer-product.model";
import { environment } from "src/environments/environment";

@Injectable()
export class CustomerProductService {
    private endpoint: string = "customers";

    constructor(
        private http: HttpClient
    ) { }

    findProductByCustomer(id: number): Observable<CustomerProductModel[]> {
        return this.http.get<CustomerProductModel[]>(`${environment.urlApiResource}/${this.endpoint}/${id}/product`);
    }

    findProductByCustomerById(customerId: number, id: number): Observable<CustomerProductModel[]> {
        return this.http.get<CustomerProductModel[]>(`${environment.urlApiResource}/${this.endpoint}/${customerId}/product/${id}`);
    }

    save(model: CustomerProductModel): Observable<CustomerProductModel> {
        if (model.id != null && model.id > 0)
            return this.put(model.id, model);
        else
            return this.post(model);
    }

    put(id: number, model: CustomerProductModel): Observable<CustomerProductModel> {
        return this.http.put<CustomerProductModel>(`${environment.urlApiResource}/${this.endpoint}/${model.customerId}/product/${id}`, model);
    }

    post(model: CustomerProductModel): Observable<CustomerProductModel> {
        return this.http.post<CustomerProductModel>(`${environment.urlApiResource}/${this.endpoint}/${model.customerId}/product/`, model);
    }

    remove(id: number, customerId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.urlApiResource}/${this.endpoint}/${customerId}/product/${id}`);
    }

}