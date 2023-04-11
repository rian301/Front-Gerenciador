import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from 'src/app/app.material';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { AssetsCategoryModel } from 'src/app/models/assets-category.model';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { AssetsCategoryService } from 'src/app/services/admin/assets-category.service';
import { ExpenseCategoryService } from 'src/app/services/admin/expense-category.service';
import { ExpenseCategoryComponent } from '../../financial/expense-category/expense-category/expense-category.component';
import { CategoryBensComponent } from '../category-bens/category-bens.component';

@Component({
  selector: 'app-category-bens-list',
  templateUrl: './category-bens-list.component.html',
  styleUrls: ['./category-bens-list.component.scss']
})
export class CategoryBensListComponent implements OnInit {
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;
  displayedColumns: string[] = ['name', 'action'];
  columnsExport: string[] = ['name'];
  columnsExportName: string[] = ['Nome'];
  title: string = "Categorias de despesas";
  filterProviderValue: number;
  loading: boolean = false;
  dataSource = new MatTableDataSource();
  providers: DropDownModel[] = [];
  
  constructor(
    private _assetsCategoryService: AssetsCategoryService,
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService,
    private _dialog: MatDialog
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
    this._assetsCategoryService.get()
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
    const dialogRef = this._dialog.open(CategoryBensComponent, { minWidth: '50%' });
    dialogRef.afterClosed().subscribe((result: AssetsCategoryModel) => this.load());
  }

  edit(model: AssetsCategoryModel) {    
    const dialogRef = this._dialog.open(CategoryBensComponent, { minWidth: '50%', data: model });
    dialogRef.afterClosed().subscribe((result: AssetsCategoryModel) => this.load());
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: AssetsCategoryModel) => {

      let filterMentored = () => {
        return this.filterProviderValue == null || this.filterProviderValue == 0 ? true : data.id == this.filterProviderValue;
      };

      return filterMentored();
    };
  }

}
