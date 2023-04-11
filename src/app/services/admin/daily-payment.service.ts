import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponseDto } from 'src/app/dto/pagination.response.dto';
import { AwardModel } from 'src/app/models/award.model';
import { DailyPaymentDocModel } from 'src/app/models/daily-payment-doc-type.model';
import { DailyPaymentModel } from 'src/app/models/daily-payment.model';
import { DocModel } from 'src/app/models/doc.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class DailyPaymentService {
    private endpoint: string = 'dailypayment';

    constructor(private http: HttpClient) {}

    get(
        page: number = null,
        pageSize: number = null,
        name: string = null,
        dateScheduled: Date = null,
        provider: string = null,
        category: string = null,
    ): Observable<PaginationResponseDto<DailyPaymentModel>> {
        if (dateScheduled == null)
            return this.http.get<PaginationResponseDto<DailyPaymentModel>>(
                `${environment.urlApiResource}/${this.endpoint}?pageIndex=${page}&pageSize=${pageSize}&name=${name}&dateScheduled=${dateScheduled}&provider=${provider}&category=${category}`,
            );
        else {
            return this.http.get<PaginationResponseDto<DailyPaymentModel>>(
                `${environment.urlApiResource}/${
                    this.endpoint
                }?pageIndex=${page}&pageSize=${pageSize}&name=${name}&dateScheduled=${dateScheduled.toISOString()}&provider=${provider}&category=${category}`,
            );
        }
    }

    find(id: number): Observable<DailyPaymentModel> {
        return this.http.get<DailyPaymentModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
    }

    save(model: DailyPaymentModel): Observable<DailyPaymentModel> {
        if (model.id != null && model.id > 0) return this.put(model.id, model);
        else return this.post(model);
    }

    put(id: number, model: DailyPaymentModel): Observable<DailyPaymentModel> {
        return this.http.put<DailyPaymentModel>(`${environment.urlApiResource}/${this.endpoint}/${id}`, model);
    }

    post(model: DailyPaymentModel): Observable<DailyPaymentModel> {
        return this.http.post<DailyPaymentModel>(`${environment.urlApiResource}/${this.endpoint}`, model);
    }

    getDocs(dailyId: number) {
        return this.http.get<DailyPaymentDocModel[]>(`${environment.urlApiResource}/${this.endpoint}/${dailyId}/docs`);
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

    remove(id: number): Observable<boolean> {
      return this.http.delete<boolean>(`${environment.urlApiResource}/${this.endpoint}/${id}`);
    }
}
