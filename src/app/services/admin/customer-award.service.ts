import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CustomerAwardModel } from "src/app/models/customer-award.model";
import { environment } from "src/environments/environment";

@Injectable()
export class CustomerAwardService {
    private endpoint: string = "customers";

    constructor(
        private http: HttpClient
    ) { }

    findAwardByCustomer(id: number): Observable<CustomerAwardModel[]> {
        return this.http.get<CustomerAwardModel[]>(`${environment.urlApiResource}/${this.endpoint}/${id}/award`);
    }

    findAwardByCustomerById(customerId: number, id: number): Observable<CustomerAwardModel[]> {
        return this.http.get<CustomerAwardModel[]>(`${environment.urlApiResource}/${this.endpoint}/${customerId}/award/${id}`);
    }

    save(model: CustomerAwardModel): Observable<CustomerAwardModel> {
        if (model.id != null && model.id > 0)
            return this.put(model.id, model);
        else
            return this.post(model);
    }

    put(id: number, model: CustomerAwardModel): Observable<CustomerAwardModel> {
        return this.http.put<CustomerAwardModel>(`${environment.urlApiResource}/${this.endpoint}/${model.customerId}/award/${id}`, model);
    }

    post(model: CustomerAwardModel): Observable<CustomerAwardModel> {
        return this.http.post<CustomerAwardModel>(`${environment.urlApiResource}/${this.endpoint}/${model.customerId}/award/`, model);
    }

    remove(id: number, customerId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.urlApiResource}/${this.endpoint}/${customerId}/award/${id}`);
    }

}