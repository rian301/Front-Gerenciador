import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PaginationResponseDto } from "src/app/dto/pagination.response.dto";
import { CustomerSubscriptionChangeStatusModel } from "src/app/enums/customer-subscription-change-satus.model";
import { CustomerListModel, CustomerModel, CustomerSubscriptionModel } from "src/app/models";
import { CustomerDocModel } from "src/app/models/customer-exel.model";
import { CustomerLaunchModel } from "src/app/models/customer-launch.model";
import { environment } from "src/environments/environment";

@Injectable()
export class CustomerService {
	private endpoint: string = "customers";

	constructor(
		private http: HttpClient
	) { }

	// Customer
	get(page: number = null, pageSize: number = null, name: string = null, email: string = null): Observable<PaginationResponseDto<CustomerListModel>> {
		return this.http.get<PaginationResponseDto<CustomerListModel>>(`${environment.urlApiResource}/${this.endpoint}?pageIndex=${page}&pageSize=${pageSize}&name=${name}&email=${email}`);
	}

	find(id: number): Observable<CustomerModel> {
		return this.http.get<CustomerModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

  findList(id: number): Observable<CustomerListModel> {
		return this.http.get<CustomerListModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: CustomerModel): Observable<CustomerModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: CustomerModel): Observable<CustomerModel> {
		return this.http.put<CustomerModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: CustomerModel): Observable<CustomerModel> {
		return this.http.post<CustomerModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

	postAll(model: CustomerModel[]): Observable<CustomerModel[]> {
		return this.http.post<CustomerModel[]>(`${environment.urlApiResource}/${this.endpoint}/all-customers`, model);
	}

	getSubscriptions(id: number): Observable<CustomerSubscriptionModel[]> {
		return this.http.get<CustomerSubscriptionModel[]>(`${environment.urlApiResource}/${this.endpoint}/${id}/subscriptions`);
	}

	saveChangeSubscriptionsStatus(id: number, model: CustomerSubscriptionChangeStatusModel): Observable<CustomerSubscriptionChangeStatusModel> {
		return this.http.put<CustomerSubscriptionChangeStatusModel>(`${environment.urlApiResource}/${this.endpoint}/${id}/subscriptions`, model);
	}

	uploadDoc(form: FormData) : Observable<CustomerDocModel> {
        return this.http.post<CustomerDocModel>(`${environment.urlApiResource}/${this.endpoint}/import-excel`, form);
    }

	statusChange(customerId: number, status: number) {
		return this.http.post(`${environment.urlApiResource}/${this.endpoint}/${customerId}/status/${status}`, null);
	}
}
