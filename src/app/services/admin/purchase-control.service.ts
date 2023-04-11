import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PaginationResponseDto } from "src/app/dto/pagination.response.dto";
import { DocModel } from "src/app/models/doc.model";
import { PurchaseControlDocModel } from "src/app/models/purchase-control-doc.model";
import { PurchaseControlModel } from "src/app/models/purchase-control.model";
import { environment } from "src/environments/environment";

@Injectable()
export class PurchaseControlService {
  private endpoint: string = "purchasecontrol";

  constructor(
    private http: HttpClient
  ) { }

  // get(): Observable<PurchaseControlModel[]> {
  //   return this.http.get<PurchaseControlModel[]>(`${environment.urlApiResource}/${this.endpoint}`);
  // }

  get(
    page: number = null,
    pageSize: number = null,
    description: string = null,
    filterDateDelivery: Date = null,
): Observable<PaginationResponseDto<PurchaseControlModel>> {
    if (filterDateDelivery == null)
        return this.http.get<PaginationResponseDto<PurchaseControlModel>>(
            `${environment.urlApiResource}/${this.endpoint}?pageIndex=${page}&pageSize=${pageSize}&description=${description}&dateDelivery=${filterDateDelivery}`,
        );
    else {
        return this.http.get<PaginationResponseDto<PurchaseControlModel>>(
            `${environment.urlApiResource}/${
                this.endpoint
            }?pageIndex=${page}&pageSize=${pageSize}&name=${name}&dateDelivery=${filterDateDelivery.toISOString()}`,
        );
    }
}

  find(id: number): Observable<PurchaseControlModel> {
    return this.http.get<PurchaseControlModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
  }

  save(model: PurchaseControlModel): Observable<PurchaseControlModel> {
    if (model.id != null && model.id > 0)
      return this.put(model.id, model);
    else
      return this.post(model);
  }

  put(id: number, model: PurchaseControlModel): Observable<PurchaseControlModel> {
    return this.http.put<PurchaseControlModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
  }

  post(model: PurchaseControlModel): Observable<PurchaseControlModel> {
    return this.http.post<PurchaseControlModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
  }

  // Dcumentos
  getDocs(patrimonyId: number) {
    return this.http.get<PurchaseControlDocModel[]>(`${environment.urlApiResource}/${this.endpoint}/${patrimonyId}/docs`);
  }

  downloadDoc(patrimonyId: number, docId: string) {
    return this.http.get(`${environment.urlApiResource}/${this.endpoint}/${patrimonyId}/docs/${docId}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  uploadDoc(patrimonyId: number, form: FormData): Observable<PurchaseControlDocModel> {
    return this.http.post<PurchaseControlDocModel>(`${environment.urlApiResource}/${this.endpoint}/${patrimonyId}/docs`, form);
  }

  changeStatusDoc(model: DocModel): Observable<DocModel> {
    return this.http.post<DocModel>(`${environment.urlApiResource}/${this.endpoint}/${model.mentoredId}/docs/change-status`, model);
  }

}
