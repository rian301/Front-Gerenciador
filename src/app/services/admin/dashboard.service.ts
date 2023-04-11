import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DashboardModel } from "src/app/models/dashboard.model";
import { environment } from "src/environments/environment";

@Injectable()
export class DashBordService {
    private endpoint: string = "dashboard";

    constructor(
		private http: HttpClient
	) { }

    getDashborad(): Observable<DashboardModel> {
		return this.http.get<DashboardModel>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	// getAllAgent(): Observable<number> {
	// 	return this.http.get<number>(`${environment.urlApiResource}/${this.endpoint}/agent-all`);
	// }

    // getDependentByInAnalisys(): Observable<number> {
	// 	return this.http.get<number>(`${environment.urlApiResource}/${this.endpoint}/depentent`);
	// }

	// getAllDependent(): Observable<number> {
	// 	return this.http.get<number>(`${environment.urlApiResource}/${this.endpoint}/depentent-all`);
	// }
}