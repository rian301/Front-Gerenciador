import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ExpenseCategoryModel } from "src/app/models/expense-category.model";
import { environment } from "src/environments/environment";

@Injectable()
export class ExpenseCategoryService {
    private endpoint: string = "expensecategory";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<ExpenseCategoryModel[]> {
		return this.http.get<ExpenseCategoryModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<ExpenseCategoryModel> {
		return this.http.get<ExpenseCategoryModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: ExpenseCategoryModel): Observable<ExpenseCategoryModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: ExpenseCategoryModel): Observable<ExpenseCategoryModel> {
		return this.http.put<ExpenseCategoryModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: ExpenseCategoryModel): Observable<ExpenseCategoryModel> {
		return this.http.post<ExpenseCategoryModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

}