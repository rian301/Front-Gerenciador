import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  MatCheckboxChange,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "src/app/app.material";
import { OnDestroySubscriptions } from "src/app/helpers/detroy-subscriptions.helper";
import { PaginatorHelper } from "src/app/helpers/paginator.helper";
import { CustomerListModel } from "src/app/models";
import { DropDownModel } from "src/app/models/dropdown.model";
import {
  CustomerService,
  NavigationService,
  UtilitariosService,
} from "src/app/services";
import { DocumentCreator } from "src/app/services/common/export-word/doc.generator";
import { Packer } from "docx";
import { saveAs } from "file-saver";

@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.scss"],
})
export class CustomerListComponent
  extends OnDestroySubscriptions
  implements OnInit, AfterViewInit
{
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;

  form: FormGroup;
  title: string = "Alunos";
  displayedColumns: string[] = [
    "name",
    "email",
    "document",
    "status",
    "action",
  ];
  dataSource = new MatTableDataSource();
  customers: DropDownModel[] = [];
  customersBkp: CustomerListModel[] = [];
  matTableRef: MatTableDataSource<any>;
  situations: string[] = [];
  statusFilter: string = null;
  dependentsPendingFilter: boolean = false;
  filterCustomerValue: number;
  filterStatus: string = "";
  filterText: string = null;
  filterTextEmail: string = null;
  resultsLength: number = 0;
  loading: Boolean = false;
  editLabel: string = "Editar";

  constructor(
    private _customerService: CustomerService,
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService,
    private _formBuilder: FormBuilder
  ) {
    super();

    this.form = this._formBuilder.group({
      search: null,
      email: null,
    });

    // Nome
    this.form.controls["search"].valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.filterText = value;

        if (this.filterText.length >= 3 || this.filterText.length == 0) {
          if (this.paginator) this.paginator.pageIndex = 0;

          this.loadList();
        }
      });

    // E-mail
    this.form.controls["email"].valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.filterTextEmail = value;

        if (this.filterTextEmail.length >= 3 || this.filterTextEmail.length == 0) {
          if (this.paginator) this.paginator.pageIndex = 0;

          this.loadList();
        }
      });
  }

  ngOnInit(): void {
    this.loadList();
    this.filterPredicate();
  }

  ngAfterViewInit(): void {
    // Event Change pagination
    this.paginator.page.subscribe((value: string) => {
      this.loadList();
    });
  }

  loadList() {
    this.loading = true;
    this._customerService
      .get(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? parseInt(this.paginatorHelper.PageSize),
        this.filterText,
        this.filterTextEmail
      )
      .toPromise()
      .then((ret) => {
        this.loading = false;

        this.resultsLength = ret.totalItems;
        this.dataSource.data = ret.content;

        this.situations = [];
        this.customers = [];
        ret.content.forEach((item) => {
          if (!this.situations.includes(item.statusDescription))
            this.situations.push(item.statusDescription);

          if (this.customers.findIndex((f) => f.id == item.id) < 0)
            this.customers.push(new DropDownModel(item.id, item.name));
        });

        this.customersBkp = ret.content;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  new() {
    this._navigationService.customerNew();
  }

  edit(model: CustomerListModel) {
    this._navigationService.customerEdit(model.id);
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
  }

  filterSituation(filterValue: string) {
    this.matTableRef.filter = filterValue.trim().toLowerCase();
  }

  onChangeDependentsFilter(checkboxRef: MatCheckboxChange) {
    this.dependentsPendingFilter = checkboxRef.checked;
  }

  imprimir(tableRef: any) {
    tableRef.imprimir();
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: CustomerListModel) => {
      let filterCustomer = () => {
        return this.filterCustomerValue == null || this.filterCustomerValue == 0
          ? true
          : data.id == this.filterCustomerValue;
      };

      let filterStatus = () => {
        return this.filterStatus == null || this.filterStatus == ""
          ? true
          : data.statusDescription == this.filterStatus;
      };

      return filterCustomer() && filterStatus();
    };
  }

  generate(): void {
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create(
      this.customersBkp,
    );

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "example.docx");
    });
  }
}
