import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { PendencyStatusEnum } from 'src/app/enums/pendency-status.enum.ts';
import { StatusTypeEnum } from 'src/app/enums/status.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { DocModel } from 'src/app/models/doc.model';
import { PendencyDocModel } from 'src/app/models/pendency-doc-type.model';
import { PendencyModel } from 'src/app/models/pendency.mmodel';
import { NavigationService } from 'src/app/services';
import { PendencyService } from 'src/app/services/admin/pedency.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { UtilitariosService } from 'src/app/services/common/utilitarios.service';
import { PendencyDocComponent } from '../pendency-doc/pendency-doc.component';

@Component({
  selector: 'app-pendency',
  templateUrl: './pendency.component.html',
  styleUrls: ['./pendency.component.scss']
})
export class PendencyComponent extends OnDestroySubscriptions implements OnInit {
  id: number = null;
  form: FormGroup;
  statusEnum: typeof PendencyStatusEnum = PendencyStatusEnum;
  title: string = "Nova Pendência";
  loading: boolean = false;
  hidenTabs: boolean = false;
  statusCode: number;
  startDate: Date = new Date();
  statusDocFilter: number = 1;
  dataSourceDocs = new MatTableDataSource();
  displayedColumnsDoc: string[] = ['fileName', 'document', 'actions', 'upload', 'status', 'action'];
  docsList: PendencyDocModel[] = [];

  constructor(
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _dialog: MatDialog,
    private _pendencyService: PendencyService,
    private route: ActivatedRoute,
    private _navigationService: NavigationService
  ) {
    super();

    this.form = this._formbuilder.group(new PendencyModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["name"].clearValidators();
    this.form.controls["status"].clearValidators();
    this.form.controls["includDate"].clearValidators();
    this.form.controls["requester"].clearValidators();
    this.form.controls["description"].clearValidators();
    this.form.controls["resolveDate"].clearValidators();
    this.form.controls["responsible"].clearValidators();
    this.form.controls["statusDescription"].clearValidators();
    this.form.controls["includDateExport"].clearValidators();
    this.form.controls["resolveDateExport"].clearValidators();
    this.form.controls["files"].clearValidators();
  }

  ngOnInit(): void {
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
    this._pendencyService.find(this.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.validStatus(ret.status);
        this.title = "Editar Pendência";
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
    let model = <PendencyModel>this.form.value;
    this._pendencyService.save(model)
      .toPromise()
      .then((resp: PendencyModel) => {
        if (resp != null) {
          this.loading = false;
          this._snackBar.open(model.id > 0 ? `Pendência atualizado com sucesso!` : `Pendência salvo com sucesso!`);
          this.hidenTabs = false;
          this.id = resp.id;
          this._navigationService.pendencyList();
        }
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  validStatus(statusCode: number) {
    this.statusCode = statusCode;
  }

  modalConfirmationDeactivate() {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a inativação?' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.statusDeactivate();
      }
    });
  }

  modalConfirmationActivate() {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a ativação?' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.statusActivate();
      }
    });
  }

  statusActivate() {
    this._pendencyService.statusChange(this.id, PendencyStatusEnum.Resolved)
      .toPromise()
      .then(resp => {
        this.load();
        this._snackBar.open(`Pendência ativada com sucesso!`);
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  statusDeactivate() {
    this._pendencyService.statusChange(this.id, PendencyStatusEnum.InProgress)
      .toPromise()
      .then(resp => {
        this.load();
        this._snackBar.open(`Pendência inativado com sucesso!`);
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  cancel() {
    this._navigationService.pendencyList();
  }

  loadDocs() {
    this._pendencyService.getDocs(this.id)
      .toPromise()
      .then((resp: PendencyDocModel[]) => {
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
    const dialogRef = this._dialog.open(PendencyDocComponent, { minWidth: '450px', maxWidth: '450px', data: { pendencyId: this.id, isNew: true } });
    this.subscriptions.add(dialogRef.afterClosed().subscribe((ret) => {
      this.form.controls.files.setValue(ret);
      this.loadDocs();
    }));
  }

  downloadDoc(doc: PendencyDocModel) {
    this._pendencyService.downloadDoc(this.id, doc.id)
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

  downloadFile(data: any, doc: PendencyDocModel) {
    const blob = data.body;
    const url = window.URL.createObjectURL(blob);

    var link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    link.click();
  }


  modalConfirmationChangeStatus(model: PendencyDocModel) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a mudança de status?', subTitle: 'Atenção: O arquivo não será excluído.' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.changeStatusDoc(model);
      }
    });
  }

  changeStatusDoc(model: PendencyDocModel) {
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

    this._pendencyService.changeStatusDoc(doc)
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
