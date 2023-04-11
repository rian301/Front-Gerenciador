import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DocModel } from "src/app/models/doc.model";
import { ExpenseControlDocModel } from "src/app/models/expense-control-doc.model";
import { ExpenseControlModel } from "src/app/models/expense-control.model";
import { environment } from "src/environments/environment";

@Injectable()
export class ExpenseControlService {
  private endpoint: string = "expensecontrol";

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<ExpenseControlModel[]> {
    return this.http.get<ExpenseControlModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
  }

  getExpenseControlPeriod(datInit: Date, datEnd: Date): Observable<ExpenseControlModel[]> {
    return this.http.get<ExpenseControlModel[]>(`${environment.urlApiResource}/${this.endpoint}/period?datInit=${datInit.toISOString()}&datEnd=${datEnd.toISOString()}`);
  }

  find(id: number): Observable<ExpenseControlModel> {
    return this.http.get<ExpenseControlModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
  }

  save(model: ExpenseControlModel): Observable<ExpenseControlModel> {
    if (model.id != null && model.id > 0)
      return this.put(model.id, model);
    else
      return this.post(model);
  }

  put(id: number, model: ExpenseControlModel): Observable<ExpenseControlModel> {
    return this.http.put<ExpenseControlModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
  }

  post(model: ExpenseControlModel): Observable<ExpenseControlModel> {
    return this.http.post<ExpenseControlModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
  }

  getDocs(expenseId: number) {
    return this.http.get<ExpenseControlDocModel[]>(`${environment.urlApiResource}/${this.endpoint}/${expenseId}/docs`);
  }

  getDocById(idDoc: string, expenseId: number) {
    return this.http.get<ExpenseControlDocModel[]>(`${environment.urlApiResource}/${this.endpoint}/${expenseId}/docs/find/${idDoc}`);
  }

  remove(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
  }

  uploadDoc(expenseId: number, form: FormData): Observable<ExpenseControlDocModel> {
    return this.http.post<ExpenseControlDocModel>(`${environment.urlApiResource}/${this.endpoint}/${expenseId}/docs`, form);
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
