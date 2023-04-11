import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from 'src/app/app.material';
import { ModalConfirmationComponent } from 'src/app/components/modal-confirmation/modal-confirmation.component';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { DailyPaymentModel } from 'src/app/models/daily-payment.model';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { PermissionService } from 'src/app/services';
import { DailyPaymentService } from 'src/app/services/admin/daily-payment.service';
import { NavigationService } from 'src/app/services/common/navigation.service';
import { UtilitariosService } from 'src/app/services/common/utilitarios.service';

@Component({
  selector: 'app-daily-payment-list',
  templateUrl: './daily-payment-list.component.html',
  styleUrls: ['./daily-payment-list.component.scss'],
})
export class DailyPaymentListComponent extends OnDestroySubscriptions implements OnInit {
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;

  displayedColumns: string[] = ['providerName', 'dateSchedulingPayment', 'datePayment', 'amount', 'action'];
  columnsExport: string[] = ['providerName', 'amount', 'document', 'bank', 'agency', 'acount', 'pix'];
  columnsExportName: string[] = ['Fornecedor', 'Valor', 'Documento', 'Banco', 'Agencia', 'Conta', 'Pix'];
  title: string = 'Pagamentos';
  filterNameValue: number;
  filterFutureValue: string;
  filterProviderValue: string;
  filterCategoryValue: string;
  loading: boolean = false;
  dataSource = new MatTableDataSource();
  matTableRef: MatTableDataSource<any>;
  providers: DropDownModel[] = [];
  names: DropDownModel[] = [];
  futurePayments: DropDownModel[] = [];
  categories: DropDownModel[] = [];
  form: FormGroup;
  resultsLength: number = 0;
  filterText: string = null;
  filterCategory: string = null;
  filterDate: Date = null;
  filterProvider: string = null;
  startDate = new Date();
  editLabel: string = "Editar";

  constructor(
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService,
    private _paymentService: DailyPaymentService,
    private _datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private _permissionService: PermissionService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {
    super();

    this.form = this._formBuilder.group({
      search: null,
      category: null,
      dateScheduled: null,
      provider: null,
    });

    // Nome
    this.form.controls['search'].valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
      this.filterText = value;

      if (this.filterText.length >= 3 || this.filterText.length == 0) {
        if (this.paginator) this.paginator.pageIndex = 0;

        this.load();
      }
    });

    // Category
    this.form.controls['category'].valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
      this.filterCategory = value;

      if (this.filterCategory.length >= 3 || this.filterCategory.length == 0) {
        if (this.paginator) this.paginator.pageIndex = 0;

        this.load();
      }
    });

    // Date
    this.form.controls['dateScheduled'].valueChanges.pipe(debounceTime(600), distinctUntilChanged()).subscribe(value => {
      this.filterDate = value;

      if (this.filterDate != null) {
        if (this.paginator) this.paginator.pageIndex = 0;

        this.load();
      }
    });

    // Provider
    this.form.controls['provider'].valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
      this.filterProvider = value;

      if (this.filterProvider.length >= 3 || this.filterProvider.length == 0) {
        if (this.paginator) this.paginator.pageIndex = 0;

        this.load();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.sort != null)
      this.sort.sortChange.subscribe(() => {
        this.load();
        if (this.paginator)
          this.paginator.firstPage();
      });
  }

  ngOnInit(): void {
    this.load();
    this.filterPredicate();
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
  }

  load() {
    this.loading = true;
    this._paymentService
      .get(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? parseInt(this.paginatorHelper.PageSize),
        this.filterText,
        this.filterDate,
        this.filterProvider,
        this.filterCategory
      )
      .toPromise()
      .then(ret => {
        this.resultsLength = ret.totalItems;

        this.dataSource.data = ret.content;

        this.providers = [];
        this.names = [];
        this.futurePayments = [];
        this.categories = [];
        // Carrega os selects dos filtros
        ret.content.forEach(item => {
          item.dateFuturePayment = this._datePipe.transform(item.dateSchedulingPayment?.toString(), 'dd/MM/yyyy');

          item.datePaymentExport = this._datePipe.transform(item.datePayment?.toString(), 'dd/MM/yyyy');
          item.dateSchedulingPaymentExport = this._datePipe.transform(item.dateSchedulingPayment?.toString(), 'dd/MM/yyyy');

          if (this.names.findIndex(f => f.id == item.id) < 0) this.names.push(new DropDownModel(item.id, item.name));

          if (!this.providers.find(x => x.text == item.providerName)) this.providers.push(new DropDownModel(item.id, item.providerName));

          if (!this.futurePayments.find(x => x.text == item.dateFuturePayment))
            this.futurePayments.push(new DropDownModel(item.id, item.dateFuturePayment));

          if (!this.categories.find(x => x.text == item.categoryName)) this.categories.push(new DropDownModel(item.id, item.categoryName));
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

  new() {
    this._navigationService.dailyPaymentNew();
  }

  edit(model: DailyPaymentModel) {
    this._navigationService.dailyPaymentEdit(model.id);
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: DailyPaymentModel) => {
      let filterPaymentName = () => {
        return this.filterNameValue == null || this.filterNameValue == 0 ? true : data.id == this.filterNameValue;
      };

      let filterFuturePayment = () => {
        return this.filterFutureValue == null || this.filterFutureValue == '' ? true : data.dateFuturePayment == this.filterFutureValue;
      };

      let filterProvider = () => {
        return this.filterProviderValue == null || this.filterProviderValue == '' ? true : data.providerName == this.filterProviderValue;
      };

      let filterCategory = () => {
        return this.filterCategoryValue == null || this.filterCategoryValue == '' ? true : data.categoryName == this.filterCategoryValue;
      };

      return filterPaymentName() && filterFuturePayment() && filterProvider() && filterCategory();
    };
  }

  getTotal() {
    return this.dataSource.filteredData.map((t: DailyPaymentModel) => t.amount).reduce((acc, value) => acc + value, 0);
  }

  remove(id: number) {
    this.loading = true;
    this._paymentService
      .remove(id)
      .toPromise()
      .then((resp: boolean) => {
        if (resp) {
          this.loading = false;
          this.load();
          this._snackBar.open('Pagamento removido com sucesso!');
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
    var permission = this._permissionService.isValid(PermissionHelper.DAILY_PAYMENT_REMOVE);

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
