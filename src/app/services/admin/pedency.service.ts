import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DailyPaymentDocModel } from "src/app/models/daily-payment-doc-type.model";
import { DocModel } from "src/app/models/doc.model";
import { PendencyDocModel } from "src/app/models/pendency-doc-type.model";
import { PendencyModel } from "src/app/models/pendency.mmodel";
import { environment } from "src/environments/environment";

@Injectable()
export class PendencyService {
  private endpoint: string = "pendency";

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<PendencyModel[]> {
    return this.http.get<PendencyModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
  }

  find(id: number): Observable<PendencyModel> {
    return this.http.get<PendencyModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
  }

  save(model: PendencyModel): Observable<PendencyModel> {
    if (model.id != null && model.id > 0)
      return this.put(model.id, model);
    else
      return this.post(model);
  }

  put(id: number, model: PendencyModel): Observable<PendencyModel> {
    return this.http.put<PendencyModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
  }

  post(model: PendencyModel): Observable<PendencyModel> {
    return this.http.post<PendencyModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
  }

  statusChange(id: number, status: number) {
    return this.http.put(`${environment.urlApiResource}/${this.endpoint}/${id}/status/${status}`, null);
  }

  getDocs(dailyId: number) {
    return this.http.get<PendencyDocModel[]>(`${environment.urlApiResource}/${this.endpoint}/${dailyId}/docs`);
  }

  uploadDoc(dailyId: number, form: FormData): Observable<DailyPaymentDocModel> {
    return this.http.post<DailyPaymentDocModel>(`${environment.urlApiResource}/${this.endpoint}/${dailyId}/docs`, form);
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
