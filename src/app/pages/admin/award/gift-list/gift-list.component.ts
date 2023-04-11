import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DinamicTableItemModel, DinamicTableModel } from 'src/app/components/dinamic-table/dinamic-table.model';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { GiftModel } from 'src/app/models/gift.model';
import { NavigationService, UtilitariosService } from 'src/app/services';
import { GiftService } from 'src/app/services/admin/gift.service';
import { GiftComponent } from '../gift/gift.component';

@Component({
  selector: 'app-gift-list',
  templateUrl: './gift-list.component.html',
  styleUrls: ['./gift-list.component.scss']
})
export class GiftListComponent implements OnInit {
  title: string = "Brindes";
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;
  displayedColumns: string[] = ['name', 'dateIncluse', 'responsible', 'quantity', 'entrance', 'exit', 'total', 'action'];
  columnsExport: string[] = ['name', 'dateIncluseExport', 'responsible', 'quantity', 'entrance', 'exit', 'totalExport'];
  columnsExportName: string[] = ['Nome', 'Data de inclusão', 'Responsável', 'Quantidade', 'Entrada', 'Saida', 'Estoque'];

  filterProviderValue: number;
  loading: boolean = false;
  dataSource = new MatTableDataSource();
  apps: DropDownModel[] = [];
  status: string[] = [];
  filterStatus: string = "";

  constructor(
    private _utilitariosService: UtilitariosService,
    private _giftService: GiftService,
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
    this._giftService.get()
      .toPromise()
      .then((ret) => {
        this.dataSource.data = ret;
        this.apps = [];
        this.status = [];
        // Carrega os selects dos filtros
        ret.forEach(item => {
          if (this.apps.findIndex(f => f.id == item.id) < 0)
            this.apps.push(new DropDownModel(item.id, item.name));

          item.dateIncluseExport = this._datePipe.transform(item.dateIncluse?.toString(), 'dd/MM/yyyy');
          item.totalExport = item.entrance - item.exit;
          item.totalExport = item.quantity + item.entrance - item.exit;
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
    this._navigationService.giftNew();
  }

  edit(model: GiftModel) {
    this._navigationService.giftEdit(model.id);
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: GiftModel) => {

      let filterGift = () => {
        return this.filterProviderValue == null || this.filterProviderValue == 0 ? true : data.id == this.filterProviderValue;
      };

      return filterGift();
    };
  }

}
