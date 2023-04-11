import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSnackBar,
  MatTableDataSource,
} from "src/app/app.material";
import { ModalConfirmationComponent } from "src/app/components/modal-confirmation/modal-confirmation.component";
import { DependentDocTypeEnumList } from "src/app/enums/dependent-doc-type.enum";
import { listaEnumInvoiceStatus } from "src/app/enums/invoice-status.enum";
import { OnDestroySubscriptions } from "src/app/helpers/detroy-subscriptions.helper";
import { PermissionHelper } from "src/app/helpers/permission.helper";
import { DocModel } from "src/app/models/doc.model";
import { ExpenseCategoryModel } from "src/app/models/expense-category.model";
import { ExpenseControlDocModel } from "src/app/models/expense-control-doc.model";
import { ExpenseControlModel } from "src/app/models/expense-control.model";
import { ProviderModel } from "src/app/models/provider.model";
import { UtilitariosService, NavigationService } from "src/app/services";
import { ExpenseCategoryService } from "src/app/services/admin/expense-category.service";
import { ExpenseControlService } from "src/app/services/admin/expense-control.service";
import { ProviderService } from "src/app/services/admin/provider.service";
import { UtilService } from "src/app/services/admin/util.service";
import { ProductComponent } from "../../../product/product/product.component";
import { ModalPdfComponent } from "../modal-pdf/modal-pdf.component";
import { ModalViewComponent } from "../modal-view/modal-view.component";

@Component({
  selector: "app-expense-control",
  templateUrl: "./expense-control.component.html",
  styleUrls: ["./expense-control.component.scss"],
})
export class ExpenseControlComponent
  extends OnDestroySubscriptions
  implements OnInit
{
  form: FormGroup;
  id: number;
  title: string = "Novo Gasto";
  loading: boolean = false;
  isUpdate: boolean = false;
  startDate = new Date();
  statusPayment: any[] = [];
  providers: ProviderModel[] = [];
  categories: ExpenseCategoryModel[] = [];
  docsList: ExpenseControlDocModel[] = [];
  docTypes = DependentDocTypeEnumList();
  imgFile: string = "";
  hidenTabs: boolean = false;
  statusDocFilter: number = 1;
  dataSourceDocs = new MatTableDataSource();
  displayedColumnsDoc: string[] = [
    "fileName",
    "document",
    "actions",
    "upload",
    "status",
    "action",
  ];
  fileName: string;

  constructor(
    private _formbuilder: FormBuilder,
    private _dialog: MatDialog,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _expenseService: ExpenseControlService,
    private _providerService: ProviderService,
    private _categoryService: ExpenseCategoryService,
    private route: ActivatedRoute,
    private _navigationService: NavigationService
  ) {
    super();

    this.form = this._formbuilder.group(new ExpenseControlModel());
    Object.keys(this.form.controls).forEach((prop) =>
      this.form.controls[prop].setValidators(Validators.required)
    );
    this.form.controls["id"].clearValidators();
    this.form.controls["statusDescription"].clearValidators();
    this.form.controls["status"].clearValidators();
    this.form.controls["expenseCategoryName"].clearValidators();
    this.form.controls["providerName"].clearValidators();
    this.form.controls["fileName"].clearValidators();
    this.form.controls["imageUpload"].clearValidators();
    this.form.controls["paymentDateString"].clearValidators();
    this.form.controls["dateString"].clearValidators();
    this.form.controls["note"].clearValidators();
  }

  ngOnInit(): void {
    this.statusPayment = listaEnumInvoiceStatus();
    this.loadProviders();
    this.loadCategory();
    this.subscriptions.add(
      this.route.params.subscribe((params) => {
        this.id = params["id"];
        if (this.id != null) {
          this.load();
          this.isUpdate = true;
        } else {
          this.hidenTabs = true;
        }

        this.loadDocs();
      })
    );
  }

  onImageChange(e) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      this.fileName = file.name;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgFile = reader.result as string;
        this.form.patchValue({
          imgSrc: reader.result,
        });
      };
    }
    this.imgFile = null;
  }

  load() {
    this._expenseService
      .find(this.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.title = "Editar Gasto";
        this.loadDocs();
        this.hidenTabs = false;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadProviders() {
    this._providerService
      .get()
      .toPromise()
      .then((ret) => {
        this.providers = ret;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadCategory() {
    this._categoryService
      .get()
      .toPromise()
      .then((ret) => {
        this.categories = ret;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
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

    let model = <ExpenseControlModel>this.form.value;
    model.fileName = this.fileName;
    model.imageUpload = this.imgFile;
    this._expenseService
      .save(model)
      .toPromise()
      .then((resp: ExpenseControlModel) => {
        if (resp != null) {
          this.loading = false;
          this._navigationService.expenseList();
          this.loading = false;
          this._snackBar.open(
            model.id > 0
              ? `Despesa atualizada com sucesso!`
              : `Despesa salvo com sucesso!`
          );
        }
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  cancel() {
    this._navigationService.expenseList();
  }

  loadDocs() {
    this._expenseService
      .getDocs(this.id)
      .toPromise()
      .then((resp: ExpenseControlDocModel[]) => {
        this.docsList = resp;
        this.changeStatusDocFilter();
      })
      .catch((error) => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  newDoc() {
    const dialogRef = this._dialog.open(ModalPdfComponent, {
      minWidth: "450px",
      maxWidth: "450px",
      data: { id: this.id },
    });
    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(() => this.loadDocs())
    );
  }

  viewDoc(doc: ExpenseControlDocModel) {
    this._expenseService
      .getDocById(doc.id, this.id)
      .toPromise()
      .then((ret) => {
        const dialogRef = this._dialog.open(ModalViewComponent, { minWidth: '50%', data: ret });
        dialogRef.afterClosed().subscribe((result: any) => this.load());
      });
  }

  downloadDoc(doc: ExpenseControlDocModel) {
    this._expenseService
      .downloadDoc(this.id, doc.id)
      .toPromise()
      .then((resp) => {
        this.downloadFile(resp, doc);
      })
      .catch((error) => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  downloadFile(data: any, doc: ExpenseControlDocModel) {
    const blob = data.body;
    const url = window.URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.href = url;
    link.download = doc.fileName;
    link.click();
  }

  changeStatusDocFilter() {
    let active: boolean = false;
    if (this.statusDocFilter == 1) active = true;

    if (this.statusDocFilter != 0)
      this.dataSourceDocs.data = this.docsList.filter(
        (f) => f.active == active
      );
    else this.dataSourceDocs.data = this.docsList;
  }

  modalConfirmationChangeStatus(model: ExpenseControlDocModel) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, {
      minWidth: "50%",
      data: {
        title: "Deseja confirmar a mudança de status?",
        subTitle: "Atenção: O arquivo não será excluído.",
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.changeStatusDoc(model);
      }
    });
  }

  changeStatusDoc(model: ExpenseControlDocModel) {
    let active: boolean = false;
    if (model.active) active = false;
    else active = true;

    var doc = new DocModel();
    doc.docId = model.id;
    doc.mentoredId = this.id;
    // doc.companyId = this.companyId;
    doc.active = active;
    doc.type = model.typeDoc;

    this._expenseService
      .changeStatusDoc(doc)
      .toPromise()
      .then((resp: DocModel) => {
        this._snackBar.open("Status alterado com sucesso!");
        this.loadDocs();
      })
      .catch((error) => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }
}
