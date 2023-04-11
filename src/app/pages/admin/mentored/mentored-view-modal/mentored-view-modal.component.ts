import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from 'src/app/app.material';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { MentoredCompanyModel } from 'src/app/models/mentored-company.model';
import { MentoredContractModel } from 'src/app/models/mentored-contract.model';
import { MentoredPartnerModel } from 'src/app/models/mentored-parner.model';
import { InvoiceModel } from 'src/app/models/mentored-payment.model';
import { MentoredSubscriptionModel } from 'src/app/models/mentored-subscription.model';
import { MentoredModel } from 'src/app/models/mentored.model';
import { MentoredCompanyService } from 'src/app/services/admin/mentored-company.service';
import { MentoredPaymentService } from 'src/app/services/admin/mentored-payment.service';
import { MentoredSubscriptionService } from 'src/app/services/admin/mentored-subscription.service';
import { MentoredService } from 'src/app/services/admin/mentored.service';
import { UtilitariosService } from 'src/app/services/common/utilitarios.service';
import { MentoredCompanyComponent } from '../mentored-company/mentored-company.component';

@Component({
  selector: 'app-mentored-view-modal',
  templateUrl: './mentored-view-modal.component.html',
  styleUrls: ['./mentored-view-modal.component.scss']
})
export class MentoredViewModalComponent implements OnInit {
  title: string = "Vizualização do Mentorado"
  form: FormGroup;
  formCompany: FormGroup;
  loading: boolean = false;
  startDate = new Date();
  displayedColumns: string[] = ['companyName', 'cnpj', 'action'];
  displayedColumnsDoc: string[] = ['fileName', 'document', 'actions', 'upload', 'status', 'action'];
  displayedColumnsPayment: string[] = ['subscriptionDate', 'subscriptionEndDate', 'dueDate', 'paymentDate', 'initialAmount', 'discountAmount', 'totalAmount', 'installments', 'companyName', 'action'];
  displayedColumnsSubscription: string[] = ['subscriptionDate', 'productName', 'installments', 'status', 'action'];
  dataSource = new MatTableDataSource();
  dataSourcePayment = new MatTableDataSource();
  dataSourceDocs = new MatTableDataSource();
  dataSourceSub = new MatTableDataSource();
  docsList: MentoredContractModel[] = [];
  companies: DropDownModel[] = [];
  datePayments: DropDownModel[] = [];
  mentoreds: MentoredModel[] = [];
  mentoredCompanyModel: MentoredCompanyModel[] = [];
  disabled: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<MentoredViewModalComponent>,
    private _formbuilder: FormBuilder,
    private _mentoredService: MentoredService,
    private _utilitariosService: UtilitariosService,
    private _mentoredCompanyService: MentoredCompanyService,
    private _subscriptionService: MentoredSubscriptionService,
    private _mentoredPaymentService: MentoredPaymentService,
    private _dialog: MatDialog
  ) {
    this.form = this._formbuilder.group(new MentoredModel());
    this.formCompany = this._formbuilder.group(new MentoredCompanyModel());
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this._mentoredService.find(this.data)
      .toPromise()
      .then((ret: MentoredModel) => {
        if (ret.mentoredCompanies.length > 0)
          this.loadCompany();

        this.form.patchValue(ret);
        // this.loadMentoredPayment();
        // this.loadSubscriptions();
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

    loadCompany() {
    this._mentoredCompanyService.findCompanyByMentored(this.data)
      .toPromise()
      .then((ret: MentoredCompanyModel[]) => {
        if (ret != null)
          this.dataSource.data = ret;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadSubscriptions() {
    let model = new MentoredPartnerModel();
    model.mentoredId = this.data;
    model.partnerId = this.form.value.partnerId;

    this._subscriptionService.getSubscriptionByMentoredAndPartner(model)
      .toPromise()
      .then((ret: MentoredSubscriptionModel[]) => {
        if (ret != null)
          this.dataSourceSub.data = ret;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadMentoredPayment() {
    this._mentoredPaymentService.findByMentoredId(this.data)
      .toPromise()
      .then((ret: InvoiceModel[]) => {
        this.dataSourcePayment.data = ret;
        // this.loadDocs();
        this.companies = [];
        this.datePayments = [];
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  view(model: MentoredCompanyModel) {
    const dialogRef = this._dialog.open(MentoredCompanyComponent, { minWidth: '80%', data: { mentoredId: this.data, companyId: model.id, readonly: true} });
    dialogRef.afterClosed().subscribe((result: MentoredCompanyModel) => {
      this.loadCompany();
    });
  }

  close() {
    this._dialogRef.close();
  }
}
