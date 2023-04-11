import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AwardModel } from "src/app/models/award.model";
import { environment } from "src/environments/environment";

@Injectable()
export class AwardService {
    private endpoint: string = "award";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<AwardModel[]> {
		return this.http.get<AwardModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<AwardModel> {
		return this.http.get<AwardModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: AwardModel): Observable<AwardModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: AwardModel): Observable<AwardModel> {
		return this.http.put<AwardModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: AwardModel): Observable<AwardModel> {
		return this.http.post<AwardModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

}