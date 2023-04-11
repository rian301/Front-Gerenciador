import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EmployeeStatusEnum } from "src/app/enums/employee-status.enum.ts";
import { DocModel } from "src/app/models/doc.model";
import { EmployeeDocModel } from "src/app/models/employee-doc.model";
import { EmployeeModel } from "src/app/models/employee.model.ts";
import { environment } from "src/environments/environment";

@Injectable()
export class EmployeeService {
    private endpoint: string = "employee";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<EmployeeModel[]> {
		return this.http.get<EmployeeModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<EmployeeModel> {
		return this.http.get<EmployeeModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: EmployeeModel): Observable<EmployeeModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: EmployeeModel): Observable<EmployeeModel> {
		return this.http.put<EmployeeModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: EmployeeModel): Observable<EmployeeModel> {
		return this.http.post<EmployeeModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

	statusChange(id: number, status: EmployeeStatusEnum) {
		return this.http.post(`${environment.urlApiResource}/${this.endpoint}/${id}/status/${status}`, null);
	}

	getDocs(employeeId: number) {
		return this.http.get<EmployeeDocModel[]>(`${environment.urlApiResource}/${this.endpoint}/${employeeId}/docs`);
	}

	uploadDoc(employeeId: number, form: FormData): Observable<EmployeeDocModel> {
		return this.http.post<EmployeeDocModel>(`${environment.urlApiResource}/${this.endpoint}/${employeeId}/docs`, form);
	}

	changeStatusDoc(model: DocModel): Observable<DocModel> {
		return this.http.post<DocModel>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/docs/change-status`, model);
	}

	downloadDoc(mentoredId: number, docId: string) {
		return this.http.get(`${environment.urlApiResource}/${this.endpoint}/${mentoredId}/docs/${docId}`, {
			responseType: 'blob',
			observe: 'response'
		});
	}
}