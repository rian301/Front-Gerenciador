import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from 'src/app/app.material';
import { DinamicTableModel, DinamicTableItemModel } from 'src/app/components/dinamic-table/dinamic-table.model';
import { StatusTypeEnum } from 'src/app/enums/status.enum';
import { PaymentMethodModel } from 'src/app/models/payment-method.model';
import { UtilitariosService } from 'src/app/services';
import { PaymentMethodService } from 'src/app/services/admin/payment-method.service';
import { PaymentMethodComponent } from '../payment-method/payment-method.component';

@Component({
  selector: 'app-payment-method-list',
  templateUrl: './payment-method-list.component.html',
  styleUrls: ['./payment-method-list.component.scss']
})
export class PaymentMethodListComponent implements OnInit {
  matTableRef: MatTableDataSource<any>;
  loading: Boolean = false;
  source: DinamicTableModel;
  situations: string[] = [];

  constructor(
    private _utilitariosService: UtilitariosService,
    private _paymentService: PaymentMethodService,
    private _dialog: MatDialog,

  ) { }

  ngOnInit(): void {
      this.loadList();
  }

  loadList() {
    this.loading = true;
    this._paymentService
      .get()
      .toPromise()
      .then((resp: PaymentMethodModel[]) => {
        this.loading = false;
        this.situations = [];
        resp.forEach(item => {
          if (!this.situations.includes(item.statusDescription))
            this.situations.push(item.statusDescription);
          item.statusDescriptionCustom = `<span class="badge badge-status ${this.getClass(item.status)}">${item.statusDescription}</span>`;
        });

        this.source = new DinamicTableModel([
          new DinamicTableItemModel('id', 'ID'),
          new DinamicTableItemModel('description', 'Nome'),
          new DinamicTableItemModel('statusDescriptionCustom', 'Status'),
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
    const dialogRef = this._dialog.open(PaymentMethodComponent, { minWidth: '50%' });
    dialogRef.afterClosed().subscribe((result: PaymentMethodModel) => this.loadList());
  }

  edit(model: PaymentMethodModel) {
    const dialogRef = this._dialog.open(PaymentMethodComponent, { minWidth: '50%', data: model });
    dialogRef.afterClosed().subscribe((result: PaymentMethodModel) => this.loadList());
  }

  imprimir(tableRef: any) {
    tableRef.imprimir();
  }

  getClass(type: StatusTypeEnum) {
    switch (type) {
      case StatusTypeEnum.Active:
        return 'bg-success';
      case StatusTypeEnum.Inactive:
        return 'bg-danger';
    }
  }
}
