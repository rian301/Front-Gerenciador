import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { InvoiceModel } from "src/app/models/mentored-payment.model";
import { environment } from "src/environments/environment";

@Injectable()
export class InvoiceService {
  private endpoint: string = "invoice";

  constructor(private http: HttpClient) {}

  get(): Observable<InvoiceModel[]> {
    return this.http.get<InvoiceModel[]>(
      `${environment.urlApiResource}/${this.endpoint}`
    );
  }

  getByMentoredId(subscriptionId: number): Observable<InvoiceModel[]> {
    return this.http.get<InvoiceModel[]>(
      `${environment.urlApiResource}/${this.endpoint}/subscriptions/${subscriptionId}`
    );
  }

  find(id: number): Observable<InvoiceModel> {
    return this.http.get<InvoiceModel>(
      `${environment.urlApiResource}/${this.endpoint}/${id}`
    );
  }

  save(model: InvoiceModel): Observable<InvoiceModel> {
    if (model.id != null && model.id > 0) return this.put(model.id, model);
    else return this.post(model);
  }

  put(id: number, model: InvoiceModel): Observable<InvoiceModel> {
    return this.http.put<InvoiceModel>(
      `${environment.urlApiResource}/${this.endpoint}/${id}`,
      model
    );
  }

  post(model: InvoiceModel): Observable<InvoiceModel> {
    return this.http.post<InvoiceModel>(
      `${environment.urlApiResource}/${this.endpoint}`,
      model
    );
  }

  remove(id: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `${environment.urlApiResource}/${this.endpoint}/${id}`
    );
  }
}
