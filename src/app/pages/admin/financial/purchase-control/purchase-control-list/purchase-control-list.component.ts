import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from 'src/app/app.material';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { PurchaseControlModel } from 'src/app/models/purchase-control.model';
import { NavigationService, UtilitariosService } from 'src/app/services';
import { PurchaseControlService } from 'src/app/services/admin/purchase-control.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-purchase-control-list',
  templateUrl: './purchase-control-list.component.html',
  styleUrls: ['./purchase-control-list.component.scss']
})
export class PurchaseControlListComponent implements OnInit {
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;
  form: FormGroup;
  title: string = "Controle de Compras";
  dataSource = new MatTableDataSource();
  purchases: DropDownModel[] = [];
  statusFilter: string = null;
  typeFilter: string = null;
  filterPurchasesValue: string;
  displayedColumns: string[] = [
    "description",
    "amount",
    "responsableName",
    "dateSolicitation",
    "dateLimit",
    "datePurchase",
    "dateDelivery",
    "action",
  ];
  columnsExport: string[] = [
    "description",
    "amount",
    "responsableName",
    "dateSolicitation",
    "dateLimit",
    "datePurchase",
    "dateDelivery",
  ];
  columnsExportName: string[] = [
    "Descrição",
    "Valor",
    "Aprovado por",
    "Data Solicitação",
    "Data Limite",
    "Data Pagamento",
    "Data Entrega",
  ];
  loading: Boolean = false;
  resultsLength: number = 0;
  editLabel: string = "Editar";
  filterStatus: string;
  filterDescription: string;
  filterDateSolicitation: Date;
  filterDateDelivery: Date;
  startDate = new Date();

  constructor(
    private _purchaseService: PurchaseControlService,
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService,
    private _formBuilder: FormBuilder,
  ) {
    this.form = this._formBuilder.group({
      name: null,
      description: null,
      dateLimit: null,
      dateSolicitation: null,
      datePurchase: null,
      dateDelivery: null,
    });

    // Nome
    this.form.controls['description'].valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(value => {
      this.filterDescription = value;

      if (this.filterDescription.length >= 3 || this.filterDescription.length == 0) {
        if (this.paginator) this.paginator.pageIndex = 0;

        this.loadList();
      }
    });

    // Date
    this.form.controls['dateDelivery'].valueChanges.pipe(debounceTime(600), distinctUntilChanged()).subscribe(value => {
      this.filterDateDelivery = value;

      if (this.filterDateDelivery != null) {
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.sort != null)
      this.sort.sortChange.subscribe(() => {
        if (this.paginator) this.paginator.firstPage();
      });
  }

  loadList() {
    this.loading = true;
    this._purchaseService
      .get(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? parseInt(this.paginatorHelper.PageSize),
        this.filterDescription,
        this.filterDateDelivery
      )
      .toPromise()
      .then((resp) => {
        this.resultsLength = resp.totalItems;
        this.dataSource.data = resp.content;
        console.log(this.dataSource.data);

        this.loading = false;
        this.purchases = [];
        resp.content.forEach(item => {
          if (this.purchases.findIndex(f => f.id == item.id) < 0) this.purchases.push(new DropDownModel(item.id, item.description));

          // if (!this.types.includes(item.typeDescription))
          //   this.types.push(item.typeDescription);

          // if (!this.situations.includes(item.statusDescription))
          //   this.situations.push(item.statusDescription);
        });
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  new() {
    this._navigationService.purchaseControlNew();
  }

  edit(model: PurchaseControlModel) {
    this._navigationService.purchaseControlEdit(model.id);
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    // this.dataSource.filterPredicate = (data: PurchaseControlModel) => {
    //   let filterMentored = () => {
    //     return this.filterPurchasesValue == null || this.filterPurchasesValue == 0 ? true : data.id == this.filterPurchasesValue;
    //   };


    //   return filterMentored();
    // };
  }
}
