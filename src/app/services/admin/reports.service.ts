import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ExpenseReportTypeEnum } from "src/app/enums/report-expense-type.enum";
import { InvoiceModel } from "src/app/models/mentored-payment.model";
import { MentoredSubscriptionModel } from "src/app/models/mentored-subscription.model";
import { ReportExpenseControlModel } from "src/app/models/report-expense-control.model";
import { environment } from "src/environments/environment";

@Injectable()
export class ReportService {
  private endpoint: string = "reports";

  constructor(private http: HttpClient) {}

  getInvoicesPeriod(datInit: Date, datEnd: Date, paid: boolean): Observable<InvoiceModel[]> {
    return this.http.get<InvoiceModel[]>(
      `${environment.urlApiResource}/${
        this.endpoint
      }/invoices?datInit=${datInit.toISOString()}&datEnd=${datEnd.toISOString()}&paid=${paid}`
    );
  }

  GetAllSubscriptionsAsync(): Observable<MentoredSubscriptionModel[]> {
    return this.http.get<MentoredSubscriptionModel[]>(
      `${environment.urlApiResource}/${this.endpoint}/subscriptions`
    );
  }

  GetAllExpenseControlByPeriod(model: ReportExpenseControlModel) {
    return this.http.post(`${environment.urlApiResource}/${this.endpoint}/expense-control`, model, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}
