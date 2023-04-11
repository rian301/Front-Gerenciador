import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CustomerLaunchModel } from "src/app/models/customer-launch.model";
import { environment } from "src/environments/environment";

@Injectable()
export class CustomerLauncService {
    private endpoint: string = "customers";

    constructor(
        private http: HttpClient
    ) { }

    // CustomerLaunch
    findLaunchByCustomer(id: number): Observable<CustomerLaunchModel[]> {
        return this.http.get<CustomerLaunchModel[]>(`${environment.urlApiResource}/${this.endpoint}/${id}/launch`);
    }

    findLaunchByCustomerById(customerId: number, id: number): Observable<CustomerLaunchModel[]> {
        return this.http.get<CustomerLaunchModel[]>(`${environment.urlApiResource}/${this.endpoint}/${customerId}/launch/${id}`);
    }

    save(model: CustomerLaunchModel): Observable<CustomerLaunchModel> {
        if (model.id != null && model.id > 0)
            return this.put(model.id, model);
        else
            return this.post(model);
    }

    put(id: number, model: CustomerLaunchModel): Observable<CustomerLaunchModel> {
        return this.http.put<CustomerLaunchModel>(`${environment.urlApiResource}/${this.endpoint}/${model.customerId}/launch/${id}`, model);
    }

    post(model: CustomerLaunchModel): Observable<CustomerLaunchModel> {
        return this.http.post<CustomerLaunchModel>(`${environment.urlApiResource}/${this.endpoint}/${model.customerId}/launch/`, model);
    }

}