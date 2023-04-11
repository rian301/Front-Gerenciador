import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocumentsListModel } from "src/app/models/documents-list.model";
import { DocumentsModel } from "src/app/models/documents.model";
import { environment } from "src/environments/environment";

@Injectable()
export class DocumentsService {
	private endpoint: string = "legal-documents";
	private endpointInitiController: string = "init";

	constructor(
		private http: HttpClient
	) { }

	getAll(): Observable<DocumentsListModel[]> {
		return this.http.get<DocumentsListModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	getTypeDocuments(): Observable<DocumentsListModel[]> {
		return this.http.get<DocumentsListModel[]>(`${environment.urlApiResource}/${this.endpointInitiController}`);
	}

	find(id: number): Observable<DocumentsModel> {
		return this.http.get<DocumentsModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: DocumentsModel): Observable<DocumentsModel> {
		if (model.id != null && model.id > 0)
			return this.put(model);
		else
			return this.post(model);
	}

	put(model: DocumentsModel): Observable<DocumentsModel> {
		return this.http.put<DocumentsModel>(`${environment.urlApiResource}/${this.endpoint}/${model.id}`, model);
	}

	post(model: DocumentsModel): Observable<DocumentsModel> {
		return this.http.post<DocumentsModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}
}