import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { PendencyModel } from 'src/app/models/pendency.mmodel';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { PendencyService } from 'src/app/services/admin/pedency.service';

@Component({
  selector: 'app-pendency-list',
  templateUrl: './pendency-list.component.html',
  styleUrls: ['./pendency-list.component.scss']
})
export class PendencyListComponent implements OnInit {

  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;
  displayedColumns: string[] = ['name','requester', 'includDate', 'resolveDate', 'status', 'action'];
  columnsExport: string[] = ['name','requester', 'includDateExport', 'resolveDateExport', 'description', 'statusDescription'];
  columnsExportName: string[] = ['Nome', 'Solicitante', 'Data de Inclusão', 'Data Resolução', 'Descrição', 'Status'];
  title: string = "Pendências";
  filterProviderValue: number;
  loading: boolean = false;
  dataSource = new MatTableDataSource();
  pendencies: DropDownModel[] = [];
  status: string[] = [];
  filterStatus: string = "";

  constructor(
    private _pendencyService: PendencyService,
    private _utilitariosService: UtilitariosService,
    private _datePipe: DatePipe,
    private _navigationService: NavigationService
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
    this._pendencyService.get()
      .toPromise()
      .then((ret) => {
        this.dataSource.data = ret;
        this.pendencies = [];
        this.status = [];
        // Carrega os selects dos filtros
        ret.forEach(item => {
          if (this.pendencies.findIndex(f => f.id == item.id) < 0)
            this.pendencies.push(new DropDownModel(item.id, item.name));
            item.includDateExport = this._datePipe.transform(item.includDate?.toString(), 'dd/MM/yyyy');
            item.resolveDateExport = this._datePipe.transform(item.resolveDate?.toString(), 'dd/MM/yyyy');
            if (!this.status.includes(item.statusDescription))
            this.status.push(item.statusDescription);
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
    this._navigationService.pendencyNew();
  }

  edit(model: PendencyModel) {
    this._navigationService.pendencyEdit(model.id);
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: PendencyModel) => {

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
