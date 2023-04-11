import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar, MatTableDataSource } from 'src/app/app.material';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { DependentDocTypeEnumList } from 'src/app/enums/dependent-doc-type.enum';
import { listaEnumResponsable } from 'src/app/enums/responsable.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { DocModel } from 'src/app/models/doc.model';
import { PaymentMethodModel } from 'src/app/models/payment-method.model';
import { ProviderModel } from 'src/app/models/provider.model';
import { PurchaseControlDocModel } from 'src/app/models/purchase-control-doc.model';
import { PurchaseControlModel } from 'src/app/models/purchase-control.model';
import { PaymentMethodService } from 'src/app/services/admin/payment-method.service';
import { ProviderService } from 'src/app/services/admin/provider.service';
import { PurchaseControlService } from 'src/app/services/admin/purchase-control.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { NavigationService } from 'src/app/services/common/navigation.service';
import { UtilitariosService } from 'src/app/services/common/utilitarios.service';
import { ModalDocComponent } from '../../../patrimony/modal-doc/modal-doc.component';
import { ModalDocPurchaseComponent } from '../modal-doc-purchase/modal-doc-purchase.component';

@Component({
  selector: 'app-purchase-control',
  templateUrl: './purchase-control.component.html',
  styleUrls: ['./purchase-control.component.scss']
})
export class PurchaseControlComponent extends OnDestroySubscriptions implements OnInit {

  form: FormGroup;
  id: number = null;
  title: string = "Nova Compra";
  loading: boolean = false;
  isUpdate: boolean = false;
  hidenTabs: boolean = false;
  haveFile: boolean = false;
  purchases: PurchaseControlModel[] = [];
  purchase: PurchaseControlModel;
  providers: ProviderModel[] = [];
  methods: PaymentMethodModel[] = [];
  displayedColumnsDoc: string[] = ['fileName', 'document', 'actions', 'upload', 'status', 'action'];
  docsList: PurchaseControlDocModel[] = [];
  startDate: Date = new Date();
  statusDocFilter: number = 1;
  dataSourceDocs = new MatTableDataSource();
  selectedCompetence: any;
  docTypes = DependentDocTypeEnumList();
  responsables = listaEnumResponsable();

  constructor(
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService,
    private _providerService: ProviderService,
    private _purchaseService: PurchaseControlService,
    private _paymentService: PaymentMethodService
  ) {
    super();

    this.form = this._formbuilder.group(new PurchaseControlModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["requestName"].clearValidators();
    this.form.controls["link"].clearValidators();
    this.form.controls["responsible"].clearValidators();
    this.form.controls["dateLimit"].clearValidators();
    this.form.controls["dateSolicitation"].clearValidators();
    this.form.controls["datePurchase"].clearValidators();
    this.form.controls["dateDelivery"].clearValidators();
    this.form.controls["amount"].clearValidators();
    this.form.controls["note"].clearValidators();
    this.form.controls["providerId"].clearValidators();
    this.form.controls["responsableName"].clearValidators();
    this.form.controls["paymentMethodId"].clearValidators();
    this.form.controls["tracking"].clearValidators();
    this.form.controls["quantity"].clearValidators();
  }

  ngOnInit(): void {
    this.loadProviders();
    this.loadPaymentsMethods();
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != null) {
          this.load();
        }
        else {
          this.hidenTabs = true;
        }
      })
    );
  }

  load() {
    this.loading = true;
    this._purchaseService.find(this.id)
      .toPromise()
      .then((resp: PurchaseControlModel) => {
        if (resp.providerId != null)
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

  loadPaymentsMethods() {
    this.loading = true;
    this._paymentService
      .get()
      .toPromise()
      .then((resp: PaymentMethodModel[]) => {
        this.loading = false;
        this.methods = resp;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  save() {
    if (!this.form.valid) {
      console.log(this.form);
      this._utilService.FormValidate(this.form);
      return;
    }
    this.loading = true;
    let model = <PurchaseControlModel>this.form.value;
    this._purchaseService
      .save(model)
      .toPromise()
      .then((resp: PurchaseControlModel) => {
        if (resp) {
          this.hidenTabs = false;
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Compra atualizado com sucesso!` : `Compra salvo com sucesso!`);
          this._navigationService.purchaseControlList();
        }
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  cancel() {
    this._navigationService.purchaseControlList();
  }

  newDoc() {
    const dialogRef = this._dialog.open(ModalDocPurchaseComponent, { minWidth: '1000px', maxWidth: '1000px', data: { mentoredId: this.id } });
    this.subscriptions.add(dialogRef.afterClosed().subscribe(() => this.loadDocs()));
  }

  loadDocs() {
    this._purchaseService.getDocs(this.id)
      .toPromise()
      .then((resp: PurchaseControlDocModel[]) => {
        this.docsList = resp;
        this.changeStatusDocFilter();
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  downloadDoc(doc: PurchaseControlDocModel) {
    this._purchaseService.downloadDoc(this.id, doc.id)
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

  downloadFile(data: any, doc: PurchaseControlDocModel) {
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

  modalConfirmationChangeStatus(model: PurchaseControlDocModel) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a mudança de status?', subTitle: 'Atenção: O arquivo não será excluído.' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.changeStatusDoc(model);
      }
    });
  }

  changeStatusDoc(model: PurchaseControlDocModel) {
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

    this._purchaseService.changeStatusDoc(doc)
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
}
