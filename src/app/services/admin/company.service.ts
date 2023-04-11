import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocModel } from "src/app/models/doc.model";
import { MentoredCompanyModel } from "src/app/models/mentored-company.model";
import { MentoredContractModel } from "src/app/models/mentored-contract.model";
import { environment } from "src/environments/environment";

@Injectable()
export class CompanyService {
	private endpoint: string = "company";

	constructor(
		private http: HttpClient
	) { }

	get(): Observable<MentoredCompanyModel[]> {
		return this.http.get<MentoredCompanyModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}
}