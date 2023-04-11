import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PaginationResponseDto } from "src/app/dto/pagination.response.dto";
import { SentGetModel } from "src/app/models/sent-get.model";
import { SentModel } from "src/app/models/sent.model";
import { environment } from "src/environments/environment";

@Injectable()
export class SentService {
  private endpoint: string = "sent";

  constructor(
    private http: HttpClient
  ) { }

  get(
    page: number = null,
    pageSize: number = null,
    customerName: string = null,
    mentoredName: string = null,
    awardName: string = null,
    status: number = 0
  ): Observable<PaginationResponseDto<SentModel>> {
    return this.http.get<PaginationResponseDto<SentModel>>
      (`${environment.urlApiResource}/${this.endpoint}?pageIndex=${page}&pageSize=${pageSize}&customer=${customerName}&mentored=${mentoredName}&award=${awardName}&status=${status}`);
  }

  find(id: number): Observable<SentGetModel> {
    return this.http.get<SentGetModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
  }

  save(model: SentModel): Observable<SentModel> {
    if (model.id != null && model.id > 0)
      return this.put(model.id, model);
    else
      return this.post(model);
  }

  put(id: number, model: SentModel): Observable<SentModel> {
    return this.http.put<SentModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
  }

  post(model: SentModel): Observable<SentModel> {
    return this.http.post<SentModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
  }

}
