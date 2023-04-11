import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProviderModel } from "src/app/models/provider.model";
import { environment } from "src/environments/environment";

@Injectable()
export class ProviderService {
    private endpoint: string = "provider";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<ProviderModel[]> {
		return this.http.get<ProviderModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<ProviderModel> {
		return this.http.get<ProviderModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: ProviderModel): Observable<ProviderModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: ProviderModel): Observable<ProviderModel> {
		return this.http.put<ProviderModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: ProviderModel): Observable<ProviderModel> {
		return this.http.post<ProviderModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

}