import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocModel } from "src/app/models/doc.model";
import { MentoredCompanyModel } from "src/app/models/mentored-company.model";
import { MentoredContractModel } from "src/app/models/mentored-contract.model";
import { environment } from "src/environments/environment";

@Injectable()
export class MentoredCompanyService {
	private endpoint: string = "mentored";

	constructor(
		private http: HttpClient
	) { }

	get(): Observable<MentoredCompanyModel[]> {
		return this.http.get<MentoredCompanyModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	findCompanyByMentored(id: number): Observable<MentoredCompanyModel[]> {
		return this.http.get<MentoredCompanyModel[]>(`${environment.urlApiResource}/${this.endpoint}/${id}/company`);
	}

	findCompanyById(id: number, companyId: number): Observable<MentoredCompanyModel[]> {
		return this.http.get<MentoredCompanyModel[]>(`${environment.urlApiResource}/${this.endpoint}/${id}/company/${companyId}`);
	}

	save(model: MentoredCompanyModel): Observable<MentoredCompanyModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: MentoredCompanyModel): Observable<MentoredCompanyModel> {
		return this.http.put<MentoredCompanyModel>(`${environment.urlApiResource}/${this.endpoint}/${id}/company/${model.id}`, model);
	}

	post(model: MentoredCompanyModel): Observable<MentoredCompanyModel> {		
		return this.http.post<MentoredCompanyModel>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/company`, model);
	}

	// Dcumentos
	getDocs(mentoredId: number) {
		return this.http.get<MentoredContractModel[]>(`${environment.urlApiResource}/${this.endpoint}/${mentoredId}/docs`);
	}

	downloadDoc(mentoredId: number, docId: string) {
		return this.http.get(`${environment.urlApiResource}/${this.endpoint}/${mentoredId}/docs/${docId}`, {
			responseType: 'blob',
			observe: 'response'
		});
	}

	uploadDoc(mentoredId: number, form: FormData): Observable<MentoredContractModel> {
		return this.http.post<MentoredContractModel>(`${environment.urlApiResource}/${this.endpoint}/${mentoredId}/docs`, form);
	}

	changeStatusDoc(model: DocModel): Observable<DocModel> {
		return this.http.post<DocModel>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/docs/change-status`, model);
	}
}