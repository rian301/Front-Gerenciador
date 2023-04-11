import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar, MatTableDataSource } from 'src/app/app.material';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { listaEnumPatrimonyStatus } from 'src/app/enums/patrimony-status.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { AssetsCategoryModel } from 'src/app/models/assets-category.model';
import { DocModel } from 'src/app/models/doc.model';
import { PatrimonyDocModel } from 'src/app/models/patrimony-doc.model';
import { PatrimonyModel } from 'src/app/models/patrimony.model';
import { ProviderModel } from 'src/app/models/provider.model';
import { NavigationService } from 'src/app/services';
import { AssetsCategoryService } from 'src/app/services/admin/assets-category.service';
import { PatrimonyService } from 'src/app/services/admin/patrimony.service';
import { ProviderService } from 'src/app/services/admin/provider.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { UtilitariosService } from 'src/app/services/common/utilitarios.service';
import { ModalDocComponent } from '../modal-doc/modal-doc.component';

@Component({
  selector: 'app-patrimony',
  templateUrl: './patrimony.component.html',
  styleUrls: ['./patrimony.component.scss'],
})
export class PatrimonyComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  id: number = null;
  title: string = 'Novo Patrimônio';
  startDate = new Date();
  loading: boolean = false;
  hidenTabs: boolean = false;
  providers: ProviderModel[] = [];
  categories: AssetsCategoryModel[] = [];
  docsList: PatrimonyDocModel[] = [];
  statusDocFilter: number = 1;
  status = listaEnumPatrimonyStatus();
  dataSourceDocs = new MatTableDataSource();
  displayedColumnsDoc: string[] = ['fileName', 'document', 'actions', 'upload', 'status', 'action'];

  constructor(
    private _formbuilder: FormBuilder,
    private _providerService: ProviderService,
    private _utilitariosService: UtilitariosService,
    private _patrimonyService: PatrimonyService,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _navigationService: NavigationService,
    private route: ActivatedRoute,
    private _assetsCategoryService: AssetsCategoryService,
    private _dialog: MatDialog,
  ) {
    super();

    this.form = this._formbuilder.group(new PatrimonyModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));

    this.form.controls['id'].clearValidators();
    this.form.controls['tag'].clearValidators();
    this.form.controls['brand'].clearValidators();
    this.form.controls['numberSerie'].clearValidators();
    this.form.controls['purchaseDate'].clearValidators();
    this.form.controls['value'].clearValidators();
    this.form.controls['statusDescription'].clearValidators();
    this.form.controls['note'].clearValidators();
    this.form.controls['categoryName'].clearValidators();
    this.form.controls['providerName'].clearValidators();
    this.form.controls['nf'].clearValidators();
    this.form.controls['assetsCategoryId'].clearValidators();
    this.form.controls['providerId'].clearValidators();
  }

  ngOnInit(): void {
    this.loadProviders();
    this.loadCategoryBen();

    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != null) {
          this.load();
        }
        else{
          this.hidenTabs = true;
        }
      }),
    );
  }

  load() {
    this._patrimonyService
      .find(this.id)
      .toPromise()
      .then(ret => {
        this.form.patchValue(ret);
        this.title = 'Editar Patrimônio';
        this.loadDocs();
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadProviders() {
    this._providerService
      .get()
      .toPromise()
      .then(ret => {
        this.providers = ret;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadCategoryBen() {
    this.loading = true;
    this._assetsCategoryService.get()
      .toPromise()
      .then((ret) => {
        this.loading = false;
        this.categories = ret;
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
    let model = <PatrimonyModel>this.form.value;
    this._patrimonyService
      .save(model)
      .toPromise()
      .then((resp: PatrimonyModel) => {
        if (resp) {
          this.hidenTabs = false;
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Patrimônio atualizado com sucesso!` : `Patrimônio salvo com sucesso!`);
          this._navigationService.patrimonyList();
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
    this._navigationService.patrimonyList();
  }

  newDoc() {
    const dialogRef = this._dialog.open(ModalDocComponent, { minWidth: '1000px', maxWidth: '1000px', data: { mentoredId: this.id } });
    this.subscriptions.add(dialogRef.afterClosed().subscribe(() => this.loadDocs()));
  }

  loadDocs() {
    this._patrimonyService.getDocs(this.id)
      .toPromise()
      .then((resp: PatrimonyDocModel[]) => {
        this.docsList = resp;
        this.changeStatusDocFilter();
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  downloadDoc(doc: PatrimonyDocModel) {
    this._patrimonyService.downloadDoc(this.id, doc.id)
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

  downloadFile(data: any, doc: PatrimonyDocModel) {
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

  modalConfirmationChangeStatus(model: PatrimonyDocModel) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a mudança de status?', subTitle: 'Atenção: O arquivo não será excluído.' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.changeStatusDoc(model);
      }
    });
  }

  changeStatusDoc(model: PatrimonyDocModel) {
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

    this._patrimonyService.changeStatusDoc(doc)
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
