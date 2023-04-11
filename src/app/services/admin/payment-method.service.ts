import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PaymentMethodModel } from "src/app/models/payment-method.model";
import { environment } from "src/environments/environment";

@Injectable()
export class PaymentMethodService {
    private endpoint: string = "paymentmethod";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<PaymentMethodModel[]> {
		return this.http.get<PaymentMethodModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<PaymentMethodModel> {
		return this.http.get<PaymentMethodModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: PaymentMethodModel): Observable<PaymentMethodModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: PaymentMethodModel): Observable<PaymentMethodModel> {
		return this.http.put<PaymentMethodModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: PaymentMethodModel): Observable<PaymentMethodModel> {
		return this.http.post<PaymentMethodModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

	statusChange(paymentmethodId: number, status: number) {
		return this.http.put(`${environment.urlApiResource}/${this.endpoint}/${paymentmethodId}/status/${status}`, null);
	}

}