import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentModel } from "src/app/models/document.model";
import { environment } from "src/environments/environment";

@Injectable()
export class DocumentService {
    private endpoint: string = "document";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<DocumentModel[]> {
		return this.http.get<DocumentModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<DocumentModel> {
		return this.http.get<DocumentModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: DocumentModel): Observable<DocumentModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: DocumentModel): Observable<DocumentModel> {
		return this.http.put<DocumentModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: DocumentModel): Observable<DocumentModel> {
		return this.http.post<DocumentModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

}