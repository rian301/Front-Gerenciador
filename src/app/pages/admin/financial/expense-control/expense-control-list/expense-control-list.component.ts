import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatSort, MatTableDataSource } from 'src/app/app.material';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { ExpenseControlDocModel } from 'src/app/models/expense-control-doc.model';
import { ExpenseControlModel } from 'src/app/models/expense-control.model';
import { UtilitariosService, NavigationService, PermissionService } from 'src/app/services';
import { ExpenseControlService } from 'src/app/services/admin/expense-control.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-expense-control-list',
  templateUrl: './expense-control-list.component.html',
  styleUrls: ['./expense-control-list.component.scss']
})
export class ExpenseControlListComponent implements OnInit {
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;

  form: FormGroup;
  displayedColumnsExpense: string[] = ['description', 'providerName', 'date', 'value', 'paymentDate', 'expenseCategoryName', 'action'];
  columnsExport: string[] = ['providerName', 'dateString', 'paymentDateString', 'value', 'expenseCategoryName'];
  columnsExportName: string[] = ['Descrição', 'Data', 'Data Pagamento', 'Valor', 'Categoria'];
  dataSource = new MatTableDataSource();
  matTableRef: MatTableDataSource<any>;
  statusFilter: string;
  filterBusinessValue: number;
  filterPeriodValue: number;
  categories: DropDownModel[] = [];
  providers: DropDownModel[] = [];
  periods: any[] = [];
  expenses: DropDownModel[] = [];
  filterExpenseValue: string;
  filterCategory: number;
  filterProvider: number;
  title: string = "Gastos";
  startDateInit: Date;
  startDateEnd: Date;
  loading: boolean = false;
  editLabel: string = "Editar"

  constructor(
    private _formbuilder: FormBuilder,
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService,
    private _utilService: UtilService,
    private _expenseService: ExpenseControlService,
    private _datePipe: DatePipe,
    private _permissionService: PermissionService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.sort != null)
      this.sort.sortChange.subscribe(() => {
        if (this.paginator)
          this.paginator.firstPage();
      });
  }

  ngOnInit(): void {
    var ret = this.getDateLocalStorage('date');
    if (ret == null) {
      this.startDateInit = new Date();
      this.startDateEnd = new Date();
      this.startDateInit.setDate(this.startDateInit.getDate() - 30);
    }
    else {
      this.startDateInit = new Date(ret.dateInit);
      this.startDateEnd = new Date(ret.dateEnd);
    }

    this.form = this._formbuilder.group({
      id: [null],
      datInit: [this.startDateInit, Validators.required],
      datEnd: [this.startDateEnd, Validators.required]
    });
    this.filterPredicate();
    this.load();
  }

  setDate(key: string, dateInit: Date, dateEnd: Date) {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({ dateInit, dateEnd }));
    var ret = this.getDateLocalStorage(key);
    this.startDateInit = ret.dateInit;
    this.startDateEnd = ret.dateEnd;
  }

  getDateLocalStorage(key: string) {
    var get = localStorage.getItem(key);
    var ret = JSON.parse(get);
    return ret;
  }

  load() {
    if (!this.form.valid) {
      this._utilService.FormValidate(this.form);
      return;
    }
    this.setDate('date', this.form.controls.datInit.value, this.form.controls.datEnd.value);
    this.loading = true;
    this._expenseService.getExpenseControlPeriod(this.form.value.datInit, this.form.value.datEnd)
      .toPromise()
      .then((ret) => {
        this.categories = [];
        this.expenses = [];
        this.providers = [];
        this.dataSource.data = ret;

        // Carrega os selects dos filtros
        ret.forEach(item => {
          item.paymentDateString = this._datePipe.transform(item.paymentDate?.toString(), 'dd/MM/yyyy');
          item.dateString = this._datePipe.transform(item.date?.toString(), 'dd/MM/yyyy');
          if (this.providers.findIndex(f => f.id == item.providerId) < 0)
            this.providers.push(new DropDownModel(item.providerId, item.providerName));

          if (this.categories.findIndex(f => f.id == item.expenseCategoryId) < 0)
            this.categories.push(new DropDownModel(item.expenseCategoryId, item.expenseCategoryName));
        });
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: ExpenseControlModel) => {

      let filterCategory = () => {
        return this.filterCategory == null || this.filterCategory == 0 ? true : data.expenseCategoryId == this.filterCategory;
      };

      let filterProvider = () => {
        return this.filterProvider == null || this.filterProvider == 0 ? true : data.providerId == this.filterProvider;
      };


      return filterCategory() && filterProvider();
    };
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  new() {
    this._navigationService.expenseNew();
  }

  edit(model: ExpenseControlModel) {
    this._navigationService.expenseEdit(model.id);
  }

  remove(id: number) {
    this.loading = true;
    this._expenseService
      .remove(id)
      .toPromise()
      .then((resp: boolean) => {
        if (resp) {
          this.loading = false;
          this.load();
          this._snackBar.open('Gasto removido com sucesso!');
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
    var permission = this._permissionService.isValid(PermissionHelper.EXPANSE_CONTROL_REMOVE);

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

  filterSituation(filterValue: string) {
    this.matTableRef.filter = filterValue.trim().toLowerCase();
  }

  imprimir(tableRef: any) {
    tableRef.imprimir();
  }

  downloadFile(data: any, doc: ExpenseControlDocModel) {
    const blob = data.body;
    const url = window.URL.createObjectURL(blob);

    var link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    link.click();
  }

  getTotal() {
    return this.dataSource.filteredData.map((t: ExpenseControlModel) => t.value).reduce((acc, value) => acc + value, 0);
  }
}
