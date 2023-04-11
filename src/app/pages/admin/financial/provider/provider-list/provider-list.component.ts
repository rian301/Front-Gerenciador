import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { ProviderModel } from 'src/app/models/provider.model';
import { NavigationService, UtilitariosService } from 'src/app/services';
import { ProviderService } from 'src/app/services/admin/provider.service';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent extends OnDestroySubscriptions implements OnInit {
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;
  displayedColumns: string[] = ['name', 'bank', 'agency', 'acount', 'pix', 'action'];
  columnsExport: string[] = ['name', 'bank', 'agency', 'acount', 'pix'];
  columnsExportName: string[] = ['Nome', 'Banco', 'Agência', 'Conta', 'Pix'];
  title: string = "Fornecedores";
  filterProviderValue: number;
  loading: boolean = false;
  dataSource = new MatTableDataSource();
  providers: DropDownModel[] = [];

  constructor(
    private _providerService: ProviderService,
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService
  ) {
    super();
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
    this.load();
    this.filterPredicate();
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
  }

  load() {
    this.loading = true;
    this._providerService.get()
      .toPromise()
      .then((ret) => {
        this.dataSource.data = ret;
        this.providers = [];
        // Carrega os selects dos filtros
        ret.forEach(item => {
          if (this.providers.findIndex(f => f.id == item.id) < 0)
            this.providers.push(new DropDownModel(item.id, item.name));

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
    this._navigationService.providerNew();
  }

  edit(model: ProviderModel) {
    this._navigationService.providerEdit(model.id);
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: ProviderModel) => {

      let filterMentored = () => {
        return this.filterProviderValue == null || this.filterProviderValue == 0 ? true : data.id == this.filterProviderValue;
      };

      return filterMentored();
    };
  }

}
