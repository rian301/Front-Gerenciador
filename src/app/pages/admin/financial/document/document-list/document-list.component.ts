import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from 'src/app/app.material';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { DocumentModel } from 'src/app/models/document.model';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { DocumentService } from 'src/app/services/admin/document.service';
import { ExpenseCategoryComponent } from '../../expense-category/expense-category/expense-category.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {

  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;
  displayedColumns: string[] = ['name', 'action'];
  columnsExport: string[] = ['name'];
  columnsExportName: string[] = ['Nome'];
  title: string = "Documentos";
  filterProviderValue: number;
  loading: boolean = false;
  dataSource = new MatTableDataSource();
  providers: DropDownModel[] = [];
  
  constructor(
    private _documentService: DocumentService,
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
    this._documentService.get()
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
    dialogRef.afterClosed().subscribe((result: DocumentModel) => this.load());
  }

  edit(model: DocumentModel) {    
    const dialogRef = this._dialog.open(ExpenseCategoryComponent, { minWidth: '50%', data: model });
    dialogRef.afterClosed().subscribe((result: DocumentModel) => this.load());
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: DocumentModel) => {

      let filterMentored = () => {
        return this.filterProviderValue == null || this.filterProviderValue == 0 ? true : data.id == this.filterProviderValue;
      };

      return filterMentored();
    };
  }

}
