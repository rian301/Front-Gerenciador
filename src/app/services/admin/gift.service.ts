import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocModel } from "src/app/models/doc.model";
import { GiftDocModel } from "src/app/models/gift-doc-type.model";
import { GiftModel } from "src/app/models/gift.model";
import { environment } from "src/environments/environment";

@Injectable()
export class GiftService {
    private endpoint: string = "gift";

    constructor(
		private http: HttpClient
	) { }

    get(): Observable<GiftModel[]> {
		return this.http.get<GiftModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
	}

	find(id: number): Observable<GiftModel> {
		return this.http.get<GiftModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
	}

	save(model: GiftModel): Observable<GiftModel> {
		if (model.id != null && model.id > 0)
			return this.put(model.id, model);
		else
			return this.post(model);
	}

	put(id: number, model: GiftModel): Observable<GiftModel> {
		return this.http.put<GiftModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
	}

	post(model: GiftModel): Observable<GiftModel> {
		return this.http.post<GiftModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
	}

  getDocs(dailyId: number) {
    return this.http.get<GiftDocModel[]>(`${environment.urlApiResource}/${this.endpoint}/${dailyId}/docs`);
  }

  uploadDoc(dailyId: number, form: FormData): Observable<GiftDocModel> {
    return this.http.post<GiftDocModel>(`${environment.urlApiResource}/${this.endpoint}/${dailyId}/docs`, form);
  }

  downloadDoc(mentoredId: number, docId: string) {
    return this.http.get(`${environment.urlApiResource}/${this.endpoint}/${mentoredId}/docs/${docId}`, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  changeStatusDoc(model: DocModel): Observable<DocModel> {
    return this.http.post<DocModel>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/docs/change-status`, model);
  }

}
