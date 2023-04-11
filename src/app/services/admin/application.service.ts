import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApplicationModel } from "src/app/models/application.model";
import { environment } from "src/environments/environment";

@Injectable()
export class ApplicationService {
    private endpoint: string = "app";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<ApplicationModel[]> {
		return this.http.get<ApplicationModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<ApplicationModel> {
		return this.http.get<ApplicationModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model:ApplicationModel): Observable<ApplicationModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model:ApplicationModel): Observable<ApplicationModel> {
		return this.http.put<ApplicationModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model:ApplicationModel): Observable<ApplicationModel> {
		return this.http.post<ApplicationModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

}
