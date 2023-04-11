import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatSort, MatTableDataSource } from 'src/app/app.material';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { ExpenseCategoryModel } from 'src/app/models/expense-category.model';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { ExpenseCategoryService } from 'src/app/services/admin/expense-category.service';
import { ExpenseCategoryComponent } from '../expense-category/expense-category.component';

@Component({
  selector: 'app-expense-category-list',
  templateUrl: './expense-category-list.component.html',
  styleUrls: ['./expense-category-list.component.scss']
})
export class ExpenseCategoryListComponent implements OnInit {
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
    private _expenseService: ExpenseCategoryService,
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
    this._expenseService.get()
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
    const dialogRef = this._dialog.open(ExpenseCategoryComponent, { minWidth: '50%' });
    dialogRef.afterClosed().subscribe((result: ExpenseCategoryModel) => this.load());
  }

  edit(model: ExpenseCategoryModel) {    
    const dialogRef = this._dialog.open(ExpenseCategoryComponent, { minWidth: '50%', data: model });
    dialogRef.afterClosed().subscribe((result: ExpenseCategoryModel) => this.load());
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: ExpenseCategoryModel) => {

      let filterMentored = () => {
        return this.filterProviderValue == null || this.filterProviderValue == 0 ? true : data.id == this.filterProviderValue;
      };

      return filterMentored();
    };
  }

}
