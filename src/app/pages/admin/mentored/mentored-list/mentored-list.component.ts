import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog,
  MatSnackBar,
} from "src/app/app.material";
import { ModalConfirmationComponent } from "src/app/components/modal-confirmation/modal-confirmation.component";
import { OnDestroySubscriptions } from "src/app/helpers/detroy-subscriptions.helper";
import { PaginatorHelper } from "src/app/helpers/paginator.helper";
import { PermissionHelper } from "src/app/helpers/permission.helper";
import { DropDownModel } from "src/app/models/dropdown.model";
import { MentoredModel } from "src/app/models/mentored.model";
import { UtilitariosService, NavigationService, PermissionService } from "src/app/services";
import { CompanyService } from "src/app/services/admin/company.service";
import { MentoredService } from "src/app/services/admin/mentored.service";
import { MentoredViewModalComponent } from "../mentored-view-modal/mentored-view-modal.component";

@Component({
  selector: "app-mentored-list",
  templateUrl: "./mentored-list.component.html",
  styleUrls: ["./mentored-list.component.scss"],
})
export class MentoredListComponent
  extends OnDestroySubscriptions
  implements OnInit
{
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;

  dataSource = new MatTableDataSource();
  dataSourceBk = new MatTableDataSource();
  form: FormGroup;
  displayedColumns: string[] = [
    "name",
    "email",
    "cpf",
    "birthDate",
    "instagram",
    "status",
    "action",
  ];
  columnsExport: string[] = [
    "name",
    "email",
    "birthDateString",
    "cpf",
    "rg",
    "phoneNumber",
    "street",
    "district",
    "city",
    "state",
    "country",
    "zipCode",
    "complement",
    "number",
    "instagram",
    "companyName",
    "cnpj",
    "companyCity",
    "companyState",
    "companyDistrict",
    "companyStreet",
    "companyNumber",
    "companyZipCode",
    "companyComplement",
  ];
  columnsExportName: string[] = [
    "Nome",
    "E-mail",
    "Data de nascimento",
    "CPF",
    "RG",
    "Telefone",
    "Rua",
    "Bairro",
    "Cidade",
    "Estado",
    "País",
    "CEP",
    "Complemento",
    "Número",
    "Instagram",
    "Empresa",
    "CNPJ",
    "Estado Empresa",
    "Cidade Empresa",
    "Bairro Empresa",
    "Rua Empresa",
    "Número Empresa",
    "CEP Empresa",
    "Complemento Empresa",
  ];
  statusFilter: string;
  filterPeriodValue: number;
  mentoreds: DropDownModel[] = [];
  notPayment: DropDownModel[] = [];
  months: string[] = [];
  companies: DropDownModel[] = [];
  filterMentoredValue: number;
  filterMonthMentoredValue: string;
  filterExpenseValue: string;
  filterMentoredCompanyValue: any = null;
  title: string = "Mentoria";
  startDateInit = new Date();
  startDateEnd = new Date();
  loading: boolean = false;
  hasPaymentCompanyInAnalisys: boolean = false;
  hasPaymentCompanyConcluded: boolean = false;
  filterText: string = null;
  birthDate: string;

  constructor(
    private _formbuilder: FormBuilder,
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService,
    private _mentoredService: MentoredService,
    private _dialog: MatDialog,
    private _datePipe: DatePipe,
    private _permissionService: PermissionService,
    private _snackBar: MatSnackBar,
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.sort != null)
      this.sort.sortChange.subscribe(() => {
        if (this.paginator) this.paginator.firstPage();
      });
  }

  ngOnInit(): void {
    this.startDateInit.setDate(this.startDateInit.getDate() - 30);
    this.form = this._formbuilder.group({
      id: [null],
      datInit: [this.startDateInit, Validators.required],
      datEnd: [this.startDateEnd, Validators.required],
    });
    this.load();
    // this.loadCompanies();
    this.filterPredicate();
  }

  load(month: string = null, companyName: string = null) {
    this.loading = true;
    this._mentoredService
      .get(month, companyName)
      .toPromise()
      .then((ret: MentoredModel[]) => {
        this.dataSource.data = ret;
        this.dataSourceBk.data = ret;
        this.mentoreds = [];
        this.notPayment = [];
        this.months = [];
        this.companies = [];
        // Carrega os selects dos filtros
        ret.forEach((item) => {
          item.birthDateString = this._datePipe.transform(
            item.birthDate?.toString(),
            "dd/MM/yyyy"
          );
          if (this.mentoreds.findIndex((f) => f.id == item.id) < 0)
            this.mentoreds.push(new DropDownModel(item.id, item.name));

            if (!this.companies.find((x) => x.id == item.mentoredCompanies[0]?.id))
            this.companies.push(new DropDownModel(item.mentoredCompanies[0]?.id, item.mentoredCompanies[0]?.companyName));

            if (!this.months.includes(item.paymentDate))
            this.months.push(item.paymentDate);
          });
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  loadByPayment() {
    this.loading = true;
    this._mentoredService
      .getByPeriodAndPayment(this.form.value.datInit, this.form.value.datEnd)
      .toPromise()
      .then((ret) => {
        this.dataSource.data = ret;
        this.mentoreds = [];
        this.notPayment = [];
        this.months = [];
        if (ret.length <= 0) this.dataSource.data = this.dataSourceBk.data;
        // Carrega os selects dos filtros
        ret.forEach((item) => {
          if (this.mentoreds.findIndex((f) => f.id == item.id) < 0)
            this.mentoreds.push(new DropDownModel(item.id, item.name));

          if (!this.months.includes(item.paymentDate))
            this.months.push(item.paymentDate);
        });
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: MentoredModel) => {
      let filterMentored = () => {
        return this.filterMentoredValue == null || this.filterMentoredValue == 0
          ? true
          : data.id == this.filterMentoredValue;
      };

      let filterMentoredCompany = () => {
        return this.filterMentoredCompanyValue == null || this.filterMentoredCompanyValue == "" ? true : data.mentoredCompanies[0]?.id == this.filterMentoredCompanyValue;
      };

      let filterMonth = () => {
        return this.filterMonthMentoredValue == null ||
          this.filterMonthMentoredValue == ""
          ? true
          : data.paymentDate == this.filterMonthMentoredValue;
      };

      let filterDescription = () => {
        return this.filterExpenseValue == null || this.filterExpenseValue == ""
          ? true
          : data.name == this.filterExpenseValue;
      };

      let filterPaymentPendant = () => {
        return this.hasPaymentCompanyInAnalisys == false
          ? true
          : data.hasPaymentCompanyInAnalisys ==
              this.hasPaymentCompanyInAnalisys;
      };

      let filterPaymentConcluded = () => {
        return this.hasPaymentCompanyConcluded == false
          ? true
          : data.hasPaymentCompanyConcluded == this.hasPaymentCompanyConcluded;
      };

      let search = () => {
        if (
          this.filterText == null ||
          this.filterText == "" ||
          this.filterText.length < 3
        )
          return true;
        else
          return (
            data.name
              .trim()
              .toLowerCase()
              .includes(this.filterText.trim().toLowerCase()) ||
            data.email
              .trim()
              .toLowerCase()
              .includes(this.filterText.trim().toLowerCase())
          );
      };

      return (
        filterMentored() &&
        filterDescription() &&
        filterPaymentPendant() &&
        filterMonth() &&
        filterPaymentConcluded() &&
        filterMentoredCompany()
      );
    };
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
  }

  new() {
    this._navigationService.mentoredNew();
  }

  edit(model: MentoredModel) {
    this._navigationService.mentoredEdit(model.id);
  }

  filterSituation(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  imprimir(tableRef: any) {
    tableRef.imprimir();
  }

  view(model: MentoredModel) {
    const dialogRef = this._dialog.open(MentoredViewModalComponent, {
      minWidth: "90%",
      data: model.id,
    });
    dialogRef.afterClosed().subscribe((result: MentoredModel) => {
      this._navigationService.mentoreds();
    });
  }

  searchMonth() {
    if (this.birthDate.length >= 1) this.load(this.birthDate);
    else this.load();
  }

  remove(id: number) {
    this.loading = true;
    this._mentoredService
      .remove(id)
      .toPromise()
      .then((resp: boolean) => {
        if (resp) {
          this.loading = false;
          this.load();
          this._snackBar.open('Mentorado removido com sucesso!');
        }
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  modalConfirmationRemove(id: number) {
    var permission = this._permissionService.isValid(PermissionHelper.MENTORED_REMOVE);

    if (permission) {
      const dialogRef = this._dialog.open(ModalConfirmationComponent, {
        minWidth: "50%",
        data: {
          title: "Deseja confirmar a exlusão?",
          subTitle: "Ao confirmar não será possível desfazer a ação.",
        },
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.remove(id);
        }
      });
    }
    else {
      this._utilitariosService.SnackAlert('Seu erfil não tem permissão para executar esta ação.', 'error');
    }
  }
}
