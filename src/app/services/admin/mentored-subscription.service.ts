import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SubscriptionStatusEnum } from "src/app/enums";
import { MentoredPartnerModel } from "src/app/models/mentored-parner.model";
import { MentoredSubscriptionModel } from "src/app/models/mentored-subscription.model";
import { environment } from "src/environments/environment";

@Injectable()
export class MentoredSubscriptionService {
    private endpoint: string = "mentoreds";

    constructor(
		private http: HttpClient
	) { }

    get(mentoredId: number): Observable<MentoredSubscriptionModel[]> {
		return this.http.get<MentoredSubscriptionModel[]>(`${environment.urlApiResource}/${this.endpoint}/${mentoredId}/subscriptions`);
	}

	getSubscriptionByMentoredAndPartner(model: MentoredPartnerModel): Observable<MentoredSubscriptionModel[]> {
		return this.http.get<MentoredSubscriptionModel[]>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/subscriptions/partner?partnerId=${model.partnerId}`);
	}

	getById(id: number, mentoredId: number): Observable<MentoredSubscriptionModel> {
		return this.http.get<MentoredSubscriptionModel>(`${environment.urlApiResource}/${this.endpoint}/${mentoredId}/subscriptions/${id}`);
	}

	getByPeriod(datInit: Date, datEnd: Date): Observable<MentoredSubscriptionModel[]> {
		return this.http.get<MentoredSubscriptionModel[]>(`${environment.urlApiResource}/${this.endpoint}/period?datInit=${datInit.toISOString()}&datEnd=${datEnd.toISOString()}/subscriptions`);
	}

	getByPeriodAndPayment(datInit: Date, datEnd: Date): Observable<MentoredSubscriptionModel[]> {
		return this.http.get<MentoredSubscriptionModel[]>(`${environment.urlApiResource}/${this.endpoint}/period-payment?datInit=${datInit.toISOString()}&datEnd=${datEnd.toISOString()}/subscriptions`);
	}

	find(id: number): Observable<MentoredSubscriptionModel> {
		return this.http.get<MentoredSubscriptionModel>(`${environment.urlApiResource}/${this.endpoint}/${id}/subscriptions`);
	}


	save(model: MentoredSubscriptionModel): Observable<MentoredSubscriptionModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: MentoredSubscriptionModel): Observable<MentoredSubscriptionModel> {
		return this.http.put<MentoredSubscriptionModel>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/subscriptions/${id}`, model);
	}

	post(model: MentoredSubscriptionModel): Observable<MentoredSubscriptionModel> {
		return this.http.post<MentoredSubscriptionModel>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/subscriptions`, model);
	}

}