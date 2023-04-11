import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from 'src/app/app.material';
import { DinamicTableItemModel, DinamicTableModel } from 'src/app/components/dinamic-table/dinamic-table.model';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { ProductModel } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/admin/product.service';
import { NavigationService } from 'src/app/services/common/navigation.service';
import { UtilitariosService } from 'src/app/services/common/utilitarios.service';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  matTableRef: MatTableDataSource<any>;
  loading: Boolean = false;
  source: DinamicTableModel;

  constructor(
    private _utilitariosService: UtilitariosService,
    private _productervice: ProductService,
    private _dialog: MatDialog,

  ) { }

  ngOnInit(): void {
      this.loadList();
  }

  loadList() {
    this.loading = true;
    this._productervice
      .get()
      .toPromise()
      .then((resp: ProductModel[]) => {
        this.loading = false;

        this.source = new DinamicTableModel([
          new DinamicTableItemModel('id', 'ID'),
          new DinamicTableItemModel('name', 'Nome'),
          new DinamicTableItemModel('quantityCustomers', 'Quantidade Alunos'),
          new DinamicTableItemModel('timeAccess', 'Tempo de Acesso'),
        ], resp);
      })
      .catch(error => {
        this.loading = false;
        this.source = new DinamicTableModel([], []);
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  searchFilter(filterValue: string) {
    if (filterValue.length >= 3)
      this.matTableRef.filter = filterValue.trim().toLowerCase();
    else
      this.matTableRef.filter = "";
  }

  new() {
    const dialogRef = this._dialog.open(ProductComponent, { minWidth: '50%' });
    dialogRef.afterClosed().subscribe((result: ProductModel) => this.loadList());
  }

  edit(model: ProductModel) {    
    const dialogRef = this._dialog.open(ProductComponent, { minWidth: '50%', data: model });
    dialogRef.afterClosed().subscribe((result: ProductModel) => this.loadList());
  }

  imprimir(tableRef: any) {
    tableRef.imprimir();
  }
}
