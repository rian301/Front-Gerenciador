import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { ApplicationModel } from 'src/app/models/application.model';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { NavigationService, UtilitariosService } from 'src/app/services';
import { ApplicationService } from 'src/app/services/admin/application.service';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {
  title: string = "Aplicativos";
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;
  displayedColumns: string[] = ['name', 'datePurchase', 'requester', 'value', 'responsible', 'dateCanceled', 'status','action'];
  columnsExport: string[] = ['name', 'datePurchaseExport', 'requester', 'value', 'signature', 'description', 'responsible', 'dateCanceledExport', 'motiveCancel', 'statusDescription'];
  columnsExportName: string[] = ['Nome', 'Data da compra', 'Solicitante', 'Valor R$', 'Assinatura', 'Descrição', 'Responsável', 'Data do cancelamento', 'Motivo', 'Status'];

  filterProviderValue: number;
  loading: boolean = false;
  dataSource = new MatTableDataSource();
  apps: DropDownModel[] = [];
  status: string[] = [];
  filterStatus: string = "";

  constructor(
    private _utilitariosService: UtilitariosService,
    private _appService: ApplicationService,
    private _navigationService: NavigationService,
    private _datePipe: DatePipe,

  ) { }

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
    this.load();
    this.filterPredicate();
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
  }

  load() {
    this.loading = true;
    this._appService.get()
      .toPromise()
      .then((ret) => {
        this.dataSource.data = ret;
        this.apps = [];
        this.status = [];
        // Carrega os selects dos filtros
        ret.forEach(item => {
          if (this.apps.findIndex(f => f.id == item.id) < 0)
            this.apps.push(new DropDownModel(item.id, item.name));

          if (!this.status.includes(item.statusDescription))
            this.status.push(item.statusDescription);

          item.dateCanceledExport = this._datePipe.transform(item.dateCanceled?.toString(), 'dd/MM/yyyy');
          item.datePurchaseExport = this._datePipe.transform(item.datePurchase?.toString(), 'dd/MM/yyyy');
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
    this._navigationService.appNew();
  }

  edit(model: ApplicationModel) {
    this._navigationService.appEdit(model.id);
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: ApplicationModel) => {

      let filterPendency = () => {
        return this.filterProviderValue == null || this.filterProviderValue == 0 ? true : data.id == this.filterProviderValue;
      };

      let filterStatus = () => {
        return this.filterStatus == null || this.filterStatus == ""
          ? true
          : data.statusDescription == this.filterStatus;
      };

      return filterPendency() && filterStatus();
    };
  }

}
