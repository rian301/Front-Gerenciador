import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocModel } from "src/app/models/doc.model";
import { PatrimonyDocModel } from "src/app/models/patrimony-doc.model";
import { PatrimonyModel } from "src/app/models/patrimony.model";
import { environment } from "src/environments/environment";

@Injectable()
export class PatrimonyService {
    private endpoint: string = "patrimony";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<PatrimonyModel[]> {
		return this.http.get<PatrimonyModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<PatrimonyModel> {
		return this.http.get<PatrimonyModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: PatrimonyModel): Observable<PatrimonyModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: PatrimonyModel): Observable<PatrimonyModel> {
		return this.http.put<PatrimonyModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: PatrimonyModel): Observable<PatrimonyModel> {
		return this.http.post<PatrimonyModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

  	// Dcumentos
	getDocs(patrimonyId: number) {
		return this.http.get<PatrimonyDocModel[]>(`${environment.urlApiResource}/${this.endpoint}/${patrimonyId}/docs`);
	}

	downloadDoc(patrimonyId: number, docId: string) {
		return this.http.get(`${environment.urlApiResource}/${this.endpoint}/${patrimonyId}/docs/${docId}`, {
			responseType: 'blob',
			observe: 'response'
		});
	}

	uploadDoc(patrimonyId: number, form: FormData): Observable<PatrimonyDocModel> {
		return this.http.post<PatrimonyDocModel>(`${environment.urlApiResource}/${this.endpoint}/${patrimonyId}/docs`, form);
	}

	changeStatusDoc(model: DocModel): Observable<DocModel> {
		return this.http.post<DocModel>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/docs/change-status`, model);
	}
}
