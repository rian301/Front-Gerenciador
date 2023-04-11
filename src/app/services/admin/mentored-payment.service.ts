import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SubscriptionStatusEnum } from "src/app/enums/subscription-status.enum";
import { InvoiceModel } from "src/app/models/mentored-payment.model";
import { MentoredSubscriptionModel } from "src/app/models/mentored-subscription.model";
import { environment } from "src/environments/environment";

@Injectable()
export class MentoredPaymentService {
    private endpoint: string = "mentoredpayment";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<InvoiceModel[]> {
		return this.http.get<InvoiceModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	findByMentoredId(id: number): Observable<InvoiceModel[]> {
		return this.http.get<InvoiceModel[]>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	findById(id: number): Observable<InvoiceModel[]> {
		return this.http.get<InvoiceModel[]>(`${environment.urlApiResource}/${this.endpoint}/id/${id}`);
	}

	save(subscriptionId: number, model: MentoredSubscriptionModel): Observable<MentoredSubscriptionModel> {		
		if (subscriptionId != null && model.id > 0)
			return this.put(subscriptionId, model);
		else
			return this.post(model);
	}

	changeStatusSubscription(id: number, status: SubscriptionStatusEnum): Observable<boolean> {
		return this.http.put<boolean>(`${environment.urlApiResource}/${this.endpoint}/${id}/change-status`, status);
	}

	put(subscriptionId: number, model: MentoredSubscriptionModel): Observable<MentoredSubscriptionModel> {
		return this.http.put<MentoredSubscriptionModel>(`${environment.urlApiResource}/${this.endpoint}/${subscriptionId}`, model);
	}

	post(model: MentoredSubscriptionModel): Observable<MentoredSubscriptionModel> {
		return this.http.post<MentoredSubscriptionModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

}