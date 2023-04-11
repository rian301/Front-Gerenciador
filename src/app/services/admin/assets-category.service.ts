import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AssetsCategoryModel } from "src/app/models/assets-category.model";
import { environment } from "src/environments/environment";

@Injectable()
export class AssetsCategoryService {
    private endpoint: string = "assetscategory";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<AssetsCategoryModel[]> {
		return this.http.get<AssetsCategoryModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<AssetsCategoryModel> {
		return this.http.get<AssetsCategoryModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: AssetsCategoryModel): Observable<AssetsCategoryModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: AssetsCategoryModel): Observable<AssetsCategoryModel> {
		return this.http.put<AssetsCategoryModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: AssetsCategoryModel): Observable<AssetsCategoryModel> {
		return this.http.post<AssetsCategoryModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

}