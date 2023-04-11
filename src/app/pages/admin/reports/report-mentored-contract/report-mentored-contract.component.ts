import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "src/app/app.material";
import { SubscriptionStatusEnum } from "src/app/enums/subscription-status.enum";
import { PaginatorHelper } from "src/app/helpers/paginator.helper";
import { DropDownModel } from "src/app/models/dropdown.model";
import { MentoredSubscriptionModel } from "src/app/models/mentored-subscription.model";
import { ReportService } from "src/app/services/admin/reports.service";
import { UtilService } from "src/app/services/admin/util.service";
import { UtilitariosService } from "src/app/services/common/utilitarios.service";

@Component({
  selector: "app-report-mentored-contract",
  templateUrl: "./report-mentored-contract.component.html",
  styleUrls: ["./report-mentored-contract.component.scss"],
})
export class ReportMentoredContractComponent implements OnInit {
  title: string = "Relatório contratos de mentoria";
  form: FormGroup;
  situations: string[] = [];
  inadiplents: DropDownModel[] = [];
  mentoreds: DropDownModel[] = [];
  startDate = new Date();

  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;

  startDateInit = new Date();
  startDateEnd = new Date();
  dateLimitInadiplent = new Date();
  displayedColumnsInvoices: string[] = [
    "id",
    "mentoredName",
    "amountTotalContract",
    "subscriptionDate",
    "endSubscriptionDate",
    "status",
  ];
  columnsExport: string[] = [
    "id",
    "mentoredName",
    "amountTotalContract",
    "subscriptionDateString",
    "endSubscriptionDateString",
  ];
  columnsExportName: string[] = [
    "id",
    "Mentorado",
    "Total",
    "Início",
    "Vencimento",
  ];
  dataSource = new MatTableDataSource();
  loading: boolean = true;
  filterStatus: string = "";
  filterMentored: string = "";
  filterText: string;
  filterMentoredValue: number;
  filteInvoiceInadiplentValue: number = 0;

  constructor(
    private _reportService: ReportService,
    private _datePipe: DatePipe,
    private _utilitariosService: UtilitariosService
  ) { }

  ngOnInit(): void {
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
    this.loading = true;
    this._reportService
      .GetAllSubscriptionsAsync()
      .toPromise()
      .then((ret) => {
        this.dataSource.data = ret;
        this.mentoreds = [];
        this.situations = [];
        // Carrega os selects dos filtros
        ret.forEach((item) => {
          item.subscriptionDateString = this._datePipe.transform(
            item.subscriptionDate?.toString(),
            "dd/MM/yyyy"
          );

          item.endSubscriptionDateString = this._datePipe.transform(
            item.endSubscriptionDate?.toString(),
            "dd/MM/yyyy"
          );

          if (!this.situations.includes(item.statusDescription))
            this.situations.push(item.statusDescription);

          if (this.mentoreds.findIndex((f) => f.id == item.id) < 0)
            this.mentoreds.push(new DropDownModel(item.id, item.mentoredName));
        });
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
    this.dataSource.filterPredicate = (data: MentoredSubscriptionModel) => {
      let filterStatus = () => {
        return this.filterStatus == null || this.filterStatus == ""
          ? true
          : data.statusDescription == this.filterStatus;
      };

      let filterMentored = () => {
        return this.filterMentoredValue == null || this.filterMentoredValue == 0
          ? true
          : data.id == this.filterMentoredValue;
      };

      return filterStatus() && filterMentored();
    };
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
