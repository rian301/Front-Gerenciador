import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatTableDataSource, MatDialog, MatPaginator, MatSort } from 'src/app/app.material';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { DocModel } from 'src/app/models/doc.model';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { MentoredAwardModel } from 'src/app/models/mentored-award.model';
import { MentoredCompanyModel } from 'src/app/models/mentored-company.model';
import { MentoredContractModel } from 'src/app/models/mentored-contract.model';
import { MentoredPartnerModel } from 'src/app/models/mentored-parner.model';
import { InvoiceModel } from 'src/app/models/mentored-payment.model';
import { MentoredSubscriptionModel } from 'src/app/models/mentored-subscription.model';
import { MentoredModel } from 'src/app/models/mentored.model';
import { NavigationService, UtilitariosService } from 'src/app/services';
import { MentoredAwardService } from 'src/app/services/admin/mentored-award.service';
import { MentoredCompanyService } from 'src/app/services/admin/mentored-company.service';
import { MentoredPaymentService } from 'src/app/services/admin/mentored-payment.service';
import { MentoredSubscriptionService } from 'src/app/services/admin/mentored-subscription.service';
import { MentoredService } from 'src/app/services/admin/mentored.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { MentoredAwardComponent } from '../mentored-award/mentored-award.component';
import { MentoredCompanyComponent } from '../mentored-company/mentored-company.component';
import { MentoredContractComponent } from '../mentored-contract/mentored-contract.component';
import { MentoredPaymentComponent } from '../mentored-payment/mentored-payment.component';
import  clonedeep from 'lodash.clonedeep';
import { MentoredStatusEnum } from 'src/app/enums/mentored-status.enum';

@Component({
  selector: 'app-mentored',
  templateUrl: './mentored.component.html',
  styleUrls: ['./mentored.component.scss']
})
export class MentoredComponent extends OnDestroySubscriptions implements OnInit {
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;
  form: FormGroup;
  id: number;
  title: string = "Novo Mentorado";
  loading: boolean = false;
  startDate = new Date();
  hidenTabs: boolean = false;
  cepDetected: boolean = true;
  displayedColumns: string[] = ['companyName', 'cnpj', 'action'];
  displayedColumnsDoc: string[] = ['fileName', 'document', 'actions', 'upload', 'status', 'action'];
  displayedColumnsPayment: string[] = ['subscriptionDate', 'subscriptionEndDate', 'dueDate', 'paymentDate', 'initialAmount', 'discountAmount', 'totalAmount', 'installments', 'companyName', 'action'];
  displayedColumnsSubscription: string[] = ['subscriptionDate', 'productName', 'installments', 'status', 'action'];
  displayedColumnsAward: string[] = [
    "id",
    "name",
    "dateSend",
    "dateReceiving",
    "action",
  ];
  dataSource = new MatTableDataSource();
  dataSourcePayment = new MatTableDataSource();
  dataSourceDocs = new MatTableDataSource();
  dataSourceSub = new MatTableDataSource();
  dataSourceAward = new MatTableDataSource();
  statusDocFilter: number = 1;
  docsList: MentoredContractModel[] = [];
  companies: DropDownModel[] = [];
  datePayments: DropDownModel[] = [];
  mentoreds: MentoredModel[] = [];
  filterCompaniesValue: number;
  filterPaymentsValue: number;
  filterPartnerValue: number;
  partnerSelected: number;
  mentoredEnum: typeof MentoredStatusEnum = MentoredStatusEnum;

  constructor(
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _utilitariosService: UtilitariosService,
    private _mentoredService: MentoredService,
    private _mentoredCompanyService: MentoredCompanyService,
    private _subscriptionService: MentoredSubscriptionService,
    private _mentoredPaymentService: MentoredPaymentService,
    private _navigationService: NavigationService,
    private _dialog: MatDialog,
    private _datePipe: DatePipe,
    private _mentoredAwardService: MentoredAwardService
  ) {
    super();

    this.form = this._formbuilder.group(new MentoredModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["note"].clearValidators();
    this.form.controls["rg"].clearValidators();
    this.form.controls["cpf"].clearValidators();
    this.form.controls["hasPaymentCompanyConcluded"].clearValidators();
    this.form.controls["paymentDate"].clearValidators();
    this.form.controls["partners"].clearValidators();
    this.form.controls["instagram"].clearValidators();
    this.form.controls["statusDescription"].clearValidators();
    this.form.controls["complement"].clearValidators();
    this.form.controls["status"].clearValidators();
    this.form.controls["createdAt"].clearValidators();
    this.form.controls["mentoredCompanies"].clearValidators();
    this.form.controls["email"].clearValidators();
    this.form.controls["phoneNumber"].clearValidators();
    this.form.controls["birthDate"].clearValidators();
    this.form.controls["zipCode"].clearValidators();
    this.form.controls["street"].clearValidators();
    this.form.controls["number"].clearValidators();
    this.form.controls["district"].clearValidators();
    this.form.controls["city"].clearValidators();
    this.form.controls["state"].clearValidators();
    this.form.controls["hasPaymentCompanyInAnalisys"].clearValidators();
    this.form.controls["birthDateString"].clearValidators();
  }

  ngAfterViewInit(): void {
    this.dataSourcePayment.paginator = this.paginator;
    this.dataSourcePayment.sort = this.sort;

    if (this.sort != null)
      this.sort.sortChange.subscribe(() => {
        if (this.paginator)
          this.paginator.firstPage();
      });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id != null) {
          this.load();
        }
        else
          this.hidenTabs = true;
      })
    );
    this.filterPredicate();
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this._mentoredService.get()
      .toPromise()
      .then((ret) => {
        this.mentoreds = ret.filter(x => x.id != this.id);
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  load() {
    this._mentoredService.find(this.id)
      .toPromise()
      .then((ret: MentoredModel) => {
        if (ret.mentoredCompanies.length > 0)
          this.loadCompany();

        this.form.patchValue(ret);
        this.loadMentoredPayment();
        this.loadSubscriptions();
        this.loadAward();

        this.title = "Editar Mentorado";
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadAward() {
    this.loading = true;
    this._mentoredAwardService
      .findAwardByMentored(this.id)
      .toPromise()
      .then((resp: MentoredAwardModel[]) => {

        this.dataSourceAward.data = resp;
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  newAward() {
    const dialogRef = this._dialog.open(MentoredAwardComponent, {
      minWidth: "50%",
      data: { mentoredId: this.id },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: MentoredAwardModel) => this.loadAward());
  }

  editAward(model: MentoredAwardModel) {
    const dialogRef = this._dialog.open(MentoredAwardComponent, {
      minWidth: "50%",
      data: { id: model.id, mentoredId: this.id },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: MentoredAwardModel) => this.loadAward());
  }

  loadCompany() {
    this._mentoredCompanyService.findCompanyByMentored(this.id)
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
    model.mentoredId = this.id;
    model.partnerId = this.form.value.partnerId;

    this._subscriptionService.getSubscriptionByMentoredAndPartner(model)
      .toPromise()
      .then((ret: MentoredSubscriptionModel[]) => {
        if (ret != null)
          this.dataSourceSub.data = ret;
          console.log(ret);

      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  loadMentoredPayment() {
    this._mentoredPaymentService.findByMentoredId(this.id)
      .toPromise()
      .then((ret: InvoiceModel[]) => {
        this.dataSourcePayment.data = ret;

        this.loadDocs();
        this.companies = [];
        this.datePayments = [];
        ret.forEach(item => {
          // item.companyName = item.mentoredCompany ? item.mentoredCompany.companyName : '';
          // this.companies.push(new DropDownModel(item.mentoredCompany.id, item.mentoredCompany.companyName));
          // item.planName = item.plan ? `${item.plan.name} - ${new CurrencyFormatPipe().transform(item.plan.amount)}` : '';
          // if (!this.companies.find((x) => x.id == item.mentoredCompany.id))
          //   this.companies.push(new DropDownModel(item.mentoredCompany.id, item.mentoredCompany.companyName));

          // item.paymentDate = item.paymentDate;
          // this.datePayments.push(new DropDownModel(item.id, this._datePipe.transform(item.paymentDate, 'dd/MM/yyyy')));
        });
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

    let model = <MentoredModel>this.form.value;

    this._mentoredService.save(model)
      .toPromise()
      .then((resp: MentoredModel) => {
        if (resp) {
          this._snackBar.open(model.id > 0 ? `Mentorado atualizado com sucesso!` : `Mentorado salvo com sucesso!`);
          this.hidenTabs = false;
          this.id = resp.id;
          this.load();
        }
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  cancel() {
    this._navigationService.mentoreds();
  }

  newMentoredCompany() {
    const dialogRef = this._dialog.open(MentoredCompanyComponent, { minWidth: '80%', data: { mentoredId: this.id } });
    dialogRef.afterClosed().subscribe((result: MentoredCompanyModel) => {
      if (result != null)
        this.loadCompany();
    });
  }

  editMentoredCompany(model: MentoredCompanyModel) {
    const dialogRef = this._dialog.open(MentoredCompanyComponent, { minWidth: '80%', data: { mentoredId: this.id, companyId: model.id } });
    dialogRef.afterClosed().subscribe((result: MentoredCompanyModel) => {
      this.loadCompany();
    });
  }

  newMentoreSubscription() {
    const dialogRef = this._dialog.open(MentoredPaymentComponent, { minWidth: '80%', data: { mentoredId: this.id } });
    dialogRef.afterClosed().subscribe((result: MentoredSubscriptionModel) => {
      if (result != null)
        this.loadSubscriptions();
    });
  }

  editMentoredSubscription(model: MentoredSubscriptionModel) {
    const dialogRef = this._dialog.open(MentoredPaymentComponent, { minWidth: '80%', data: { id: model.id, mentoredId: this.id, companyId: model.id } });
    dialogRef.afterClosed().subscribe((result: MentoredSubscriptionModel) => {
      this.loadSubscriptions();
    });
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
    const dialogRef = this._dialog.open(MentoredContractComponent, { minWidth: '1000px', maxWidth: '1000px', data: { mentoredId: this.id } });
    this.subscriptions.add(dialogRef.afterClosed().subscribe(() => this.loadDocs()));
  }

  newPayment() {
    const dialogRef = this._dialog.open(MentoredPaymentComponent, { minWidth: '50%', data: { mentoredId: this.id } });
    this.subscriptions.add(dialogRef.afterClosed().subscribe(() => this.loadMentoredPayment()));
  }

  editMentoredPayment(model: InvoiceModel) {
    const dialogRef = this._dialog.open(MentoredPaymentComponent, { minWidth: '50%', data: { mentoredId: this.id, companyId: model.id, paymentId: model.id } });
    dialogRef.afterClosed().subscribe((result: InvoiceModel) => {
      this.loadMentoredPayment();
    });
  }

  loadDocs() {
    this._mentoredCompanyService.getDocs(this.id)
      .toPromise()
      .then((resp: MentoredContractModel[]) => {
        this.docsList = resp;
        this.changeStatusDocFilter();
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  downloadDoc(doc: MentoredContractModel) {
    this._mentoredCompanyService.downloadDoc(this.id, doc.id)
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

  downloadFile(data: any, doc: MentoredContractModel) {
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

  modalConfirmationChabgeStatus(model: MentoredContractModel) {
    const dialogRef = this._dialog.open(ModalConfirmationComponent, { minWidth: '50%', data: { title: 'Deseja confirmar a mudança de status?', subTitle: 'Atenção: O arquivo não será excluído.' } });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.changeStatusDoc(model);
      }
    });
  }

  changeStatusDoc(model: MentoredContractModel) {
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

    this._mentoredCompanyService.changeStatusDoc(doc)
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

  filterSituation(filterValue: string) {
    this.dataSourcePayment.filter = filterValue.trim().toLowerCase();
  }


  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSourcePayment.filterPredicate = (data: InvoiceModel) => {

      // let filterMentoredCompany = () => {
      //   return this.filterCompaniesValue == null || this.filterCompaniesValue == 0 ? true : (data.mentoredCompany != null && data.mentoredCompany.id == this.filterCompaniesValue);
      // };

      let filterMentoredPayment = () => {
        return this.filterPaymentsValue == null || this.filterPaymentsValue == 0 ? true : data.id == this.filterPaymentsValue;
      };

      return filterMentoredPayment();
    };
  }

  searchFilter() {
    this.dataSourcePayment.filter = Math.random().toString();
    if (this.dataSourcePayment.paginator) {
      this.dataSourcePayment.paginator.firstPage();
    }
  }

  removeAwardMethod(id: number) {
    this.loading = true;
    this._mentoredAwardService
      .remove(id, this.id)
      .toPromise()
      .then((ret) => {
        this.loading = false;
        this._snackBar.open("Prêmio removido com sucesso!");
        this.loadAward();
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  onListDrop(event: CdkDragDrop<string[]>) {
    // Swap the elements around
    console.log(`Moving item from ${event.previousIndex} to index ${event.currentIndex}`)
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    console.log(`event.container ${event.container.data}`)
    this.dataSourceDocs.data = clonedeep(this.dataSourceDocs.data);
  }

  statusChange(status: MentoredStatusEnum) {
    this._mentoredService
      .statusChange(this.id, status)
      .toPromise()
      .then((resp) => {
        this._snackBar.open(`Status alterado com sucesso!`);
        this.load()
      })
      .catch((error) => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }
}

