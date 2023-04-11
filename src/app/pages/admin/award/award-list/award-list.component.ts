import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from 'src/app/app.material';
import { DinamicTableItemModel, DinamicTableModel } from 'src/app/components/dinamic-table/dinamic-table.model';
import { AwardModel } from 'src/app/models/award.model';
import { UtilitariosService } from 'src/app/services';
import { AwardService } from 'src/app/services/admin/award.service';
import { AwardComponent } from '../award/award.component';

@Component({
  selector: 'app-award-list',
  templateUrl: './award-list.component.html',
  styleUrls: ['./award-list.component.scss']
})
export class AwardListComponent implements OnInit {
  matTableRef: MatTableDataSource<any>;
  loading: Boolean = false;
  source: DinamicTableModel;
  
  constructor(
    private _utilitariosService: UtilitariosService,
    private _awardService: AwardService,
    private _dialog: MatDialog,

  ) { }

  ngOnInit(): void {
      this.loadList();
  }

  loadList() {
    this.loading = true;
    this._awardService
      .get()
      .toPromise()
      .then((resp: AwardModel[]) => {
        this.loading = false;

        this.source = new DinamicTableModel([
          new DinamicTableItemModel('id', 'ID'),
          new DinamicTableItemModel('name', 'Nome'),
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
    const dialogRef = this._dialog.open(AwardComponent, { minWidth: '50%' });
    dialogRef.afterClosed().subscribe((result: AwardModel) => this.loadList());
  }

  edit(model: AwardModel) {    
    const dialogRef = this._dialog.open(AwardComponent, { minWidth: '50%', data: model });
    dialogRef.afterClosed().subscribe((result: AwardModel) => this.loadList());
  }

  imprimir(tableRef: any) {
    tableRef.imprimir();
  }
}
