import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LaunchModel } from "src/app/models/launch.model";
import { environment } from "src/environments/environment";

@Injectable()
export class LaunchService {
    private endpoint: string = "launch";

    constructor(
		private http: HttpClient
	) { }

    getLaunch(): Observable<LaunchModel[]> {
		return this.http.get<LaunchModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<LaunchModel> {
		return this.http.get<LaunchModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: LaunchModel): Observable<LaunchModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: LaunchModel): Observable<LaunchModel> {
		return this.http.put<LaunchModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: LaunchModel): Observable<LaunchModel> {
		return this.http.post<LaunchModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

}