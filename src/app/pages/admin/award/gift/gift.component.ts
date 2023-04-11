import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { DocModel } from 'src/app/models/doc.model';
import { GiftDocModel } from 'src/app/models/gift-doc-type.model';
import { GiftModel } from 'src/app/models/gift.model';
import { NavigationService, UtilitariosService } from 'src/app/services';
import { GiftService } from 'src/app/services/admin/gift.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { GiftDocComponent } from '../gift-doc/gift-doc.component';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.scss']
})
export class GiftComponent extends OnDestroySubscriptions implements OnInit {
  id: number = null;
  form: FormGroup;
  title: string = "Novo Brinde";
  loading: boolean = false;
  statusCode: number;
  startDate: Date = new Date();
  statusDocFilter: number = 1;
  filterText: string = null;
  search: string = null;
  cepDetected: boolean = true;
  hidenTabs: boolean = false;
  dataSourceDocs = new MatTableDataSource();
  displayedColumnsDoc: string[] = ['fileName', 'document', 'actions', 'upload', 'status', 'action'];
  docsList: GiftDocModel[] = [];

  constructor(
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _giftService: GiftService,
    private route: ActivatedRoute,
    private _navigationService: NavigationService,
    private _dialog: MatDialog,
  ) {
    super();

    this.form = this._formbuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      dateIncluse: [null],
      responsible: [null],
      quantity: [null, [Validators.required]],
      entrance: [null],
      exit: [null],
      total: [0],
      files: [null],
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != null)
          this.load();
        this.loadDocs();
      })
    );
  }

  load() {
    this._giftService.find(this.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.title = "Editar Brinde";
        var total = ret.quantity + ret.entrance - ret.exit;
        this.form.controls.total.setValue(total);
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadDocs() {
    this._giftService.getDocs(this.id)
      .toPromise()
      .then((resp: GiftDocModel[]) => {
        this.docsList = resp;
        this.changeStatusDocFilter();
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
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

  newDoc() {
    const dialogRef = this._dialog.open(GiftDocComponent, { minWidth: '450px', maxWidth: '450px', data: { pendencyId: this.id, isNew: true } });
    this.subscriptions.add(dialogRef.afterClosed().subscribe((ret) => {
      this.form.controls.files.setValue(ret);
      this.loadDocs();
    }));
  }

  downloadDoc(doc: GiftDocModel) {
    this._giftService.downloadDoc(this.id, doc.id)
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

  downloadFile(data: any, doc: GiftDocModel) {
    const blob = data.body;
    const url = window.URL.createObjectURL(blob);

    var link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    link.click();
  }

  changeStatusDoc(model: GiftDocModel) {
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

    this._giftService.changeStatusDoc(doc)
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

  modalConfirmationChangeStatus(model: GiftDocModel) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a mudança de status?', subTitle: 'Atenção: O arquivo não será excluído.' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.changeStatusDoc(model);
      }
    });
  }

  save() {
    if (!this.form.valid) {
      console.log(this.form);
      this._utilService.FormValidate(this.form);
      return;
    }

    this.loading = true;
    let model = <GiftModel>this.form.value;
    this._giftService.save(model)
      .toPromise()
      .then((resp: GiftModel) => {
        if (resp != null) {
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Brinde atualizado com sucesso!` : `Brinde salvo com sucesso!`);
          this.id = resp.id;
          this._navigationService.giftList();
        }
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  changeTotal(event) {
    var total = this.form.value.quantity + this.form.value.entrance - this.form.value.exit;
    this.form.controls.total.setValue(total);
  }

  cancel() {
    this._navigationService.giftList();
  }
}
