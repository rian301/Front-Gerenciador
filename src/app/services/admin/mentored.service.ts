import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MentoredModel } from "src/app/models/mentored.model";
import { environment } from "src/environments/environment";

@Injectable()
export class MentoredService {
    private endpoint: string = "mentored";

    constructor(
		private http: HttpClient
	) { }

    get(month: string = null, companyName: string = null): Observable<MentoredModel[]> {
		return this.http.get<MentoredModel[]>(`${environment.urlApiResource}/${this.endpoint}/query/${month}/${companyName}`);
	}

	getByPeriod(datInit: Date, datEnd: Date): Observable<MentoredModel[]> {
		return this.http.get<MentoredModel[]>(`${environment.urlApiResource}/${this.endpoint}/period?datInit=${datInit.toISOString()}&datEnd=${datEnd.toISOString()}`);
	}

	getByPeriodAndPayment(datInit: Date, datEnd: Date): Observable<MentoredModel[]> {
		return this.http.get<MentoredModel[]>(`${environment.urlApiResource}/${this.endpoint}/period-payment?datInit=${datInit.toISOString()}&datEnd=${datEnd.toISOString()}`);
	}

	find(id: number): Observable<MentoredModel> {
		return this.http.get<MentoredModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: MentoredModel): Observable<MentoredModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: MentoredModel): Observable<MentoredModel> {
		return this.http.put<MentoredModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: MentoredModel): Observable<MentoredModel> {
		return this.http.post<MentoredModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

  statusChange(mentoredId: number, status: number) {
		return this.http.post(`${environment.urlApiResource}/${this.endpoint}/${mentoredId}/status/${status}`, null);
	}

  remove(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
  }
}
