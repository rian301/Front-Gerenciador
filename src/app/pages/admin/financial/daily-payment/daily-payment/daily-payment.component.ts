import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatTableDataSource } from 'src/app/app.material';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { DependentDocTypeEnumList } from 'src/app/enums/dependent-doc-type.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { DailyPaymentDocModel } from 'src/app/models/daily-payment-doc-type.model';
import { DailyPaymentModel } from 'src/app/models/daily-payment.model';
import { DocModel } from 'src/app/models/doc.model';
import { ExpenseCategoryModel } from 'src/app/models/expense-category.model';
import { ProviderModel } from 'src/app/models/provider.model';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { DailyPaymentService } from 'src/app/services/admin/daily-payment.service';
import { ExpenseCategoryService } from 'src/app/services/admin/expense-category.service';
import { ProviderService } from 'src/app/services/admin/provider.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { DailyPaymentDocComponent } from '../daily-payment-doc/daily-payment-doc.component';

@Component({
  selector: 'app-daily-payment',
  templateUrl: './daily-payment.component.html',
  styleUrls: ['./daily-payment.component.scss']
})
export class DailyPaymentComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  id: number = null;
  title: string = "Novo Pagamento";
  loading: boolean = false;
  isUpdate: boolean = false;
  hidenTabs: boolean = false;
  haveFile: boolean = false;
  providers: ProviderModel[] = [];
  provider: ProviderModel;
  categories: ExpenseCategoryModel[] = [];
  docsList: DailyPaymentDocModel[] = [];
  startDate: Date = new Date();
  statusDocFilter: number = 1;
  dataSourceDocs = new MatTableDataSource();
  displayedColumnsDoc: string[] = ['fileName', 'document', 'actions', 'upload', 'status', 'action'];
  selectedCompetence: any;
  docTypes = DependentDocTypeEnumList();

  constructor(
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _utilitariosService: UtilitariosService,
    private _paymentService: DailyPaymentService,
    private _navigationService: NavigationService,
    private _providerService: ProviderService,
    private _categoryService: ExpenseCategoryService
  ) {
    super();

    this.form = this._formbuilder.group(new DailyPaymentModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["bank"].clearValidators();
    this.form.controls["agency"].clearValidators();
    this.form.controls["acount"].clearValidators();
    this.form.controls["pix"].clearValidators();
    this.form.controls["document"].clearValidators();
    this.form.controls["note"].clearValidators();
    this.form.controls["dateSchedulingPayment"].clearValidators();
    this.form.controls["datePayment"].clearValidators();
    this.form.controls["providerName"].clearValidators();
    this.form.controls["categoryName"].clearValidators();
    this.form.controls["dateFuturePayment"].clearValidators();
    this.form.controls["typeDoc"].clearValidators();
    this.form.controls["files"].clearValidators();
    this.form.controls["datePaymentExport"].clearValidators();
    this.form.controls["dateSchedulingPaymentExport"].clearValidators();
  }

  ngOnInit(): void {
    this.loadProviders();
    this.loadCategory();
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != null) {
          this.load();
          this.loadDocs();
        }
        else {
          this.hidenTabs = true;
        }
      })
    );
  }

  load() {
    this.loading = true;
    this._paymentService.find(this.id)
      .toPromise()
      .then((resp: DailyPaymentModel) => {
        this.loadProviderById(resp.providerId);
        this.form.patchValue(resp);
        this.title = "Editar Pagamento";
        this.loading = false;
      })
      .catch(error => {
        console.log("Log de erro => ", error);
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadProviders() {
    this._providerService.get()
      .toPromise()
      .then((ret) => {
        this.providers = ret;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadProviderById(id: number) {
    this._providerService.find(id)
      .toPromise()
      .then((ret) => {
        this.form.controls.document?.setValue(ret?.document);
        this.form.controls.bank?.setValue(ret?.bank);
        this.form.controls.agency?.setValue(ret?.agency);
        this.form.controls.acount?.setValue(ret?.acount);
        this.form.controls.pix?.setValue(ret?.pix);
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadCategory() {
    this._categoryService.get()
      .toPromise()
      .then((ret) => {
        this.categories = ret;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadDocs() {
    this._paymentService.getDocs(this.id)
      .toPromise()
      .then((resp: DailyPaymentDocModel[]) => {
        this.docsList = resp;
        this.changeStatusDocFilter();
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  newDoc() {
    const dialogRef = this._dialog.open(DailyPaymentDocComponent, { minWidth: '450px', maxWidth: '450px', data: { mentoredId: this.id, isNew: true } });
    this.subscriptions.add(dialogRef.afterClosed().subscribe((ret) => {
      this.form.controls.files.setValue(ret);
      this.loadDocs()
    }));
  }

  downloadDoc(doc: DailyPaymentDocModel) {
    this._paymentService.downloadDoc(this.id, doc.id)
      .toPromise()
      .then(resp => {
        this.downloadFile(resp, doc);
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  downloadFile(data: any, doc: DailyPaymentDocModel) {
    const blob = data.body;
    const url = window.URL.createObjectURL(blob);

    var link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    link.click();
  }

  changeStatusDocFilter() {
    let active: boolean = false;
    if (this.statusDocFilter == 1)
      active = true;

    if (this.statusDocFilter != 0)
      this.dataSourceDocs.data = this.docsList.filter(f => f.active == active);
    else
      this.dataSourceDocs.data = this.docsList;
  }

  modalConfirmationChangeStatus(model: DailyPaymentDocModel) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a mudança de status?', subTitle: 'Atenção: O arquivo não será excluído.' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.changeStatusDoc(model);
      }
    });
  }

  changeStatusDoc(model: DailyPaymentDocModel) {
    let active: boolean = false;
    if (model.active)
      active = false;
    else active = true;

    var doc = new DocModel();
    doc.docId = model.id;
    doc.mentoredId = this.id;
    // doc.companyId = this.companyId;
    doc.type = model.typeDoc;
    doc.active = active;

    this._paymentService.changeStatusDoc(doc)
      .toPromise()
      .then((resp: DocModel) => {
        this._snackBar.open("Status alterado com sucesso!");
        this.loadDocs();
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  async save() {
    if (!this.form.valid) {
      console.log(this.form);
      this._utilService.FormValidate(this.form);
      return;
    }
    let model = <DailyPaymentModel>this.form.value;
    this._paymentService.save(model)
      .toPromise()
      .then(async (resp: DailyPaymentModel) => {
        if (resp != null) {
          this.loading = false;
          if (this.form.controls.files.value != null)
            await this.uploadDocs(resp.id);

          this._snackBar.open(model.id > 0 ? `Pagamento atualizado com sucesso!` : `Pagamento salvo com sucesso!`);
          this._navigationService.dailyPaymentList();
        }
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  async uploadDocs(paymentId: number) {
    this.loading = true;
    const type = this.form.controls.typeDoc.value.toString();
    const files = this.form.controls.files.value;

    let formData = new FormData();
    formData.append("type", type);

    for (var i = 0; i <= files.files.length; i++) {
      formData.append("type", type);
      formData.append("files", files.files[i]);
    }

    this._paymentService
      .uploadDoc(paymentId, formData)
      .toPromise()
      .then((ret) => {
        this.loading = false;
        this._utilitariosService.SnackAlert(
          "Documento salvo com sucesso.",
          "success"
        );
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  changeDocType(event) {
    if (this.form.controls.files.value != null) {
      this.haveFile = true;
      this.form.controls.typeDoc.setValidators(Validators.required);
    }
    else {
      this.haveFile = false;
      this.form.controls.typeDoc.setValue(null);
      this.form.controls["typeDoc"].clearValidators();
      this.form.controls["files"].clearValidators();
    }
  }

  cancel() {
    this._navigationService.dailyPaymentList();
  }

}
