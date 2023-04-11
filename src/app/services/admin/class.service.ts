import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ClassModel } from "src/app/models/class.model";
import { environment } from "src/environments/environment";

@Injectable()
export class ClassService {
    private endpoint: string = "class";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<ClassModel[]> {
		return this.http.get<ClassModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<ClassModel> {
		return this.http.get<ClassModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: ClassModel): Observable<ClassModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: ClassModel): Observable<ClassModel> {
		return this.http.put<ClassModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: ClassModel): Observable<ClassModel> {
		return this.http.post<ClassModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

}
