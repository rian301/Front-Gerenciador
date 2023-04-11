import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "src/app/app.material";
import { SubscriptionStatusEnum } from "src/app/enums";
import { PaginatorHelper } from "src/app/helpers/paginator.helper";
import { DropDownModel } from "src/app/models/dropdown.model";
import { InvoiceModel } from "src/app/models/mentored-payment.model";
import { ReportService } from "src/app/services/admin/reports.service";
import { UtilService } from "src/app/services/admin/util.service";
import { UtilitariosService } from "src/app/services/common/utilitarios.service";

@Component({
  selector: "app-report-mentored",
  templateUrl: "./report-mentored.component.html",
  styleUrls: ["./report-mentored.component.scss"],
})
export class ReportMentoredComponent implements OnInit {
  title: string = "Relatório de faturas mentoria";
  form: FormGroup;
  situations: string[] = [];
  inadiplents: DropDownModel[] = [];
  mentoreds: DropDownModel[] = [];
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;

  startDateInit = new Date();
  startDateEnd = new Date();
  dateLimitInadiplent = new Date();
  displayedColumnsInvoices: string[] = [
    "mentoredName",
    "createdAt",
    "expirationDate",
    "paidDate",
    "amount",
    "status",
  ];
  columnsExport: string[] = [
    "mentoredName",
    "createdAtString",
    "expirationDateString",
    "paidDate",
    "amount",
    "statusDescription",
  ];
  columnsExportName: string[] = [
    "Mentorado",
    "Emissão",
    "Vencimento",
    "Pagamento",
    "Valor",
    "Status",
  ];
  dataSource = new MatTableDataSource();
  loading: boolean = true;
  filterStatus: string = "";
  filterMentored: string = "";
  filterText: string;
  filterMentoredValue: number;
  filteInvoiceInadiplentValue: number = 0;
  isChecked: boolean = false;

  constructor(
    private _reportService: ReportService,
    private _datePipe: DatePipe,
    private _formbuilder: FormBuilder,
    private _utilService: UtilService,
    private _utilitariosService: UtilitariosService
  ) { }

  ngOnInit(): void {
    this.startDateInit.setDate(this.startDateInit.getDate() - 30);
    this.dateLimitInadiplent.setDate(this.dateLimitInadiplent.getDate() + 30);
    this.form = this._formbuilder.group({
      id: [null],
      datInit: [this.startDateInit, Validators.required],
      datEnd: [this.startDateEnd, Validators.required],
    });
    this.filterPredicate();
    this.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.sort != null)
      this.sort.sortChange.subscribe(() => {
        if (this.paginator) this.paginator.firstPage();
      });
  }

  load() {
    if (!this.form.valid) {
      this._utilService.FormValidate(this.form);
      return;
    }
    this.loading = true;

    this._reportService
      .getInvoicesPeriod(this.form.value.datInit, this.form.value.datEnd, this.isChecked)
      .toPromise()
      .then((ret) => {
        this.situations = [];
        this.inadiplents = [];
        this.mentoreds = [];
        this.dataSource.data = ret;
        // Carrega os selects dos filtros
        ret.forEach((item) => {
          item.expirationDateString = this._datePipe.transform(
            item.expirationDate?.toString(),
            "dd/MM/yyyy"
          );

          item.createdAtString = this._datePipe.transform(
            item.createdAt?.toString(),
            "dd/MM/yyyy"
          );
          if (!this.situations.includes(item.statusDescription))
            this.situations.push(item.statusDescription);

          if (this.mentoreds.findIndex((f) => f.id == item.mentoredId) < 0)
            this.mentoreds.push(
              new DropDownModel(item.mentoredId, item.mentoredName)
            );
        });
        this.inadiplents.push(new DropDownModel(2, "Sim"));
        this.inadiplents.push(new DropDownModel(1, "Não"));
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, "error");
        });
      });
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: InvoiceModel) => {
      let filterStatus = () => {
        return this.filterStatus == null || this.filterStatus == ""
          ? true
          : data.statusDescription == this.filterStatus;
      };

      let filterMentored = () => {
        return this.filterMentoredValue == null || this.filterMentoredValue == 0
          ? true
          : data.mentoredId == this.filterMentoredValue;
      };

      let filterInvoiceInadiplent = () => {
        return this.filteInvoiceInadiplentValue == 0
          ? true
          : this.filteInvoiceInadiplentValue == 1
            ? data.overdueSince == null
            : data.overdueSince != null;
      };

      return filterStatus() && filterMentored() && filterInvoiceInadiplent();
    };
  }

  getTotal() {
    return this.dataSource.filteredData
      .map((t: InvoiceModel) => t.amount)
      .reduce((acc, value) => acc + value, 0);
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  checkBox(event) {
    this.load();
  }
}
