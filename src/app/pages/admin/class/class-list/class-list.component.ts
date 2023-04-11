import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from 'src/app/app.material';
import { DinamicTableItemModel, DinamicTableModel } from 'src/app/components/dinamic-table/dinamic-table.model';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { ClassModel } from 'src/app/models/class.model';
import { UtilitariosService } from 'src/app/services';
import { ClassService } from 'src/app/services/admin/class.service';
import { ClassComponent } from '../class/class.component';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {
  matTableRef: MatTableDataSource<any>;
  displayedColumnsLanch: string[] = ['name', 'date', 'linkClass', 'linkInfo', 'linkCopy', 'linkCreative', 'linkTraffic', 'linkRegister', 'action'];
  dataSource = new MatTableDataSource();
  source: DinamicTableModel;
  loading: boolean = false;

  constructor(
    private _classService: ClassService,
    private _utilitariosService: UtilitariosService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
      this.loadClass();
  }

  loadClass() {
    this.loading = true;
    this._classService.get()
      .toPromise()
      .then((resp: ClassModel[]) => {
        this.dataSource.data = resp;
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }


  edit(model: ClassModel) {
    const dialogRef = this._dialog.open(ClassComponent, { minWidth: '50%', data: model });
    dialogRef.afterClosed().subscribe((result: ClassModel) => this.loadClass());
  }

  new() {
    const dialogRef = this._dialog.open(ClassComponent, { minWidth: '50%' });
    dialogRef.afterClosed().subscribe((result: ClassModel) => this.loadClass());
  }

  searchFilter(filterValue: string) {
    if (filterValue.length >= 2)
      this.dataSource.filter = filterValue.trim().toLowerCase();
    else
      this.dataSource.filter = "";
  }

  imprimir(tableRef: any) {
    tableRef.imprimir();
  }
}
