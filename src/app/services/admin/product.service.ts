import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProductModel } from "src/app/models/product.model";
import { environment } from "src/environments/environment";

@Injectable()
export class ProductService {
    private endpoint: string = "product";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<ProductModel[]> {
		return this.http.get<ProductModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<ProductModel> {
		return this.http.get<ProductModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: ProductModel): Observable<ProductModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: ProductModel): Observable<ProductModel> {
		return this.http.put<ProductModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: ProductModel): Observable<ProductModel> {
		return this.http.post<ProductModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

}