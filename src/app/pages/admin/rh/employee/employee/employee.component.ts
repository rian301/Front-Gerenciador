import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar, MatTableDataSource } from 'src/app/app.material';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { EmployeeStatusEnum } from 'src/app/enums/employee-status.enum.ts';
import { EmployeeTypeEnum, listaEnumType } from 'src/app/enums/employee-type.enum.ts';
import { listaEnumGender } from 'src/app/enums/gender.enum';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { DocModel } from 'src/app/models/doc.model';
import { EmployeeDocModel } from 'src/app/models/employee-doc.model';
import { EmployeeModel } from 'src/app/models/employee.model.ts';
import { NavigationService, UtilitariosService } from 'src/app/services';
import { EmployeeService } from 'src/app/services/admin/employee.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { ModalDocComponent } from '../modal-doc/modal-doc.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent extends OnDestroySubscriptions implements OnInit {
  displayedColumnsDoc: string[] = ['fileName', 'document', 'actions', 'upload', 'status', 'action'];
  form: FormGroup;
  id: number = null;
  title: string = "Novo Colaborador";
  startDate = new Date(1990, 0, 1);
  startDateAtual = new Date();
  loading: boolean = false;
  cepDetected: boolean = true;
  hiddenVinculo: boolean = false;
  isUpdate: boolean = false;
  filterStatusGender: string = null;
  genders: any[] = [];
  types: any[] = [];
  docsList: EmployeeDocModel[] = [];
  employeeStatusEnum: typeof EmployeeStatusEnum = EmployeeStatusEnum;
  employeeType: typeof EmployeeTypeEnum = EmployeeTypeEnum;
  dataSourceDocs = new MatTableDataSource();
  statusDocFilter: number = 1;

  constructor(
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _employeeService: EmployeeService,
    private _navigationService: NavigationService,
    private _dialog: MatDialog,
  ) {
    super();

    this.form = this._formbuilder.group(new EmployeeModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["email"].clearValidators();
    this.form.controls["rg"].clearValidators();
    this.form.controls["cnpj"].clearValidators();
    this.form.controls["cpf"].clearValidators();
    this.form.controls["phoneNumber"].clearValidators();
    this.form.controls["birthDate"].clearValidators();
    this.form.controls["admissionDate"].clearValidators();
    this.form.controls["demissionDate"].clearValidators();
    this.form.controls["function"].clearValidators();
    this.form.controls["monthlyHour"].clearValidators();
    this.form.controls["workSchedule"].clearValidators();
    this.form.controls["gender"].clearValidators();
    this.form.controls["pis"].clearValidators();
    this.form.controls["mom"].clearValidators();
    this.form.controls["father"].clearValidators();
    this.form.controls["schooling"].clearValidators();
    this.form.controls["bank"].clearValidators();
    this.form.controls["agency"].clearValidators();
    this.form.controls["acount"].clearValidators();
    this.form.controls["holeDays"].clearValidators();
    this.form.controls["holeAmountPortion"].clearValidators();
    this.form.controls["wage13"].clearValidators();
    this.form.controls["wage13Portion"].clearValidators();
    this.form.controls["zipCode"].clearValidators();
    this.form.controls["street"].clearValidators();
    this.form.controls["number"].clearValidators();
    this.form.controls["district"].clearValidators();
    this.form.controls["city"].clearValidators();
    this.form.controls["state"].clearValidators();
    this.form.controls["status"].clearValidators();
    this.form.controls["userId"].clearValidators();
    this.form.controls["note"].clearValidators();
    this.form.controls["complement"].clearValidators();
    this.form.controls["birthDate"].clearValidators();
    this.form.controls["rg"].clearValidators();
    this.form.controls["createdAt"].clearValidators();
    this.form.controls["status"].clearValidators();
    this.form.controls["statusDescription"].clearValidators();
    this.form.controls["note"].clearValidators();
    this.form.controls["country"].clearValidators();
    this.form.controls["typeDescription"].clearValidators();
    this.form.controls["pix"].clearValidators();
    this.form.controls["voterTitle"].clearValidators();
    this.form.controls["reservistCertificate"].clearValidators();
    this.form.controls["benefit"].clearValidators();
    this.form.controls["wage"].clearValidators();
  }

  ngOnInit(): void {
    this.genders = listaEnumGender();
    this.types = listaEnumType();
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != null) {
          this.isUpdate = true;
          this.loadEmployee();
        }
        this.loadDocs();
      })
    );
  }

  loadDocs() {
    this._employeeService.getDocs(this.id)
      .toPromise()
      .then((resp: EmployeeDocModel[]) => {
        this.docsList = resp;
        this.changeStatusDocFilter();
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadEmployee() {
    this.loading = true;
    this._employeeService.find(this.id)
      .toPromise()
      .then((resp: EmployeeModel) => {
        this.form.patchValue(resp);
        this.title = "Editar Colaborador";
        this.loading = false;
        if (resp.type == EmployeeTypeEnum.FREE_LANCER)
          this.hiddenVinculo = true;
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

    let model = <EmployeeModel>this.form.value;
    if (model.cnpj == "")
      model.cnpj = null;

    if (model.cpf == "")
      model.cpf = null;

    this._employeeService.save(model)
      .toPromise()
      .then((resp: EmployeeModel) => {
        if (resp != null) {
          this._snackBar.open(model.id > 0 ? `Colaborador atualizado com sucesso!` : `Colaborador salvo com sucesso!`);
          this.id = resp.id;
          this._navigationService.employeeList();
          this.loadEmployee();
        }
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  statusChange(status: EmployeeStatusEnum) {
    this._employeeService.statusChange(this.id, status)
      .toPromise()
      .then((resp: boolean) => {
        if (resp) {
          this._snackBar.open('Status alterado com sucesso!');
          this.loadEmployee();
          this._navigationService.employeeList();
        }
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  regime(value) {
    if (value == 3)
      this.hiddenVinculo = true;
    else
      this.hiddenVinculo = false;
  }

  cancel() {
    this._navigationService.employeeList();
  }

  searchCep(event) {
    let cep = event.target.value;
    if (cep.length === 9) {
      this._utilitariosService.BuscarCep(event.target.value).toPromise()
        .then(ret => {
          this.form.controls['city'].setValue(ret.localidade);
          this.form.controls['state'].setValue(ret.uf);
          this.form.controls['street'].setValue(ret.logradouro);
          this.form.controls['district'].setValue(ret.bairro);
          this.cepDetected = this.IsNullOrUndefined(ret.logradouro) ? false : true;
        })
        .catch(error => {
          this.cepDetected = false;
          console.error(error);
        })
    }
  }

  IsNullOrUndefined(value: any) {
    return value == null || value == undefined;
  }

  newDoc() {
    const dialogRef = this._dialog.open(ModalDocComponent, { minWidth: '450px', maxWidth: '450px', data: { id: this.id } });
    this.subscriptions.add(dialogRef.afterClosed().subscribe(() => this.loadDocs()));
  }

  downloadDoc(doc: EmployeeDocModel) {
    this._employeeService.downloadDoc(this.id, doc.id)
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

  downloadFile(data: any, doc: EmployeeDocModel) {
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

  modalConfirmationChangeStatus(model: EmployeeDocModel) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a mudança de status?', subTitle: 'Atenção: O arquivo não será excluído.' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.changeStatusDoc(model);
      }
    });
  }

  changeStatusDoc(model: EmployeeDocModel) {
    let active: boolean = false;
    if (model.active)
      active = false;
    else active = true;

    var doc = new DocModel();
    doc.docId = model.id;
    doc.mentoredId = this.id;
    // doc.companyId = this.companyId;
    doc.active = active;
    doc.type = model.typeDoc;

    this._employeeService.changeStatusDoc(doc)
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
