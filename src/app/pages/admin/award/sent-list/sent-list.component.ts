import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DinamicTableModel, DinamicTableItemModel } from 'src/app/components/dinamic-table/dinamic-table.model';
import { listaEnumSentType, SentStatusEnum } from 'src/app/enums/app-status.enum';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { SentModel } from 'src/app/models/sent.model';
import { NavigationService, UtilitariosService } from 'src/app/services';
import { AwardService } from 'src/app/services/admin/award.service';
import { SentService } from 'src/app/services/admin/sent.service';
import { AwardComponent } from '../award/award.component';

@Component({
  selector: 'app-sent-list',
  templateUrl: './sent-list.component.html',
  styleUrls: ['./sent-list.component.scss']
})
export class SentListComponent implements OnInit {
  title: string = "Envios";
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;
  displayedColumns: string[] = ['customerName', 'mentoredName', 'awardName', 'dateRequest', 'dateSend', 'status', 'action'];
  columnsExport: string[] = ['awardName', 'customerName', 'mentoredName', 'city', 'district', 'state', 'street', 'number', 'complement', 'zipCode', 'dateSendExport', 'campaign', 'statusDescription'];
  columnsExportName: string[] = ['Prêmio', 'Aluno', 'Mentorado', 'Cidade', 'Bairro', 'Estado', 'Rua', 'Número', 'Complemento', 'CEP', 'Data de envio', 'Campanha', 'Status'];
  filterCustomerValue: number;
  filterMentoredValue: number;
  filterAwardValue: number;
  loading: boolean = false;
  dataSource = new MatTableDataSource();
  sents: DropDownModel[] = [];
  mentoreds: DropDownModel[] = [];
  awards: DropDownModel[] = [];
  status: any[] = [];
  filterStatus: number = null;
  form: FormGroup;
  customerNameText: string = null;
  mentoredNameText: string = null;
  awardNameText: string = null;

  constructor(
    private _utilitariosService: UtilitariosService,
    private _sentService: SentService,
    private _navigationService: NavigationService,
    private _datePipe: DatePipe,
    private _formBuilder: FormBuilder,
  ) {
    this.form = this._formBuilder.group({
      customerName: null,
      mentoredName: null,
      awardName: null,
    });

    // Customer
    this.form.controls['customerName'].valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.customerNameText = value;

      if (this.customerNameText.length >= 3 || this.customerNameText.length == 0) {
        if (this.paginator) this.paginator.pageIndex = 0;

        this.load();
      }
    });

    // Mentored
    this.form.controls['mentoredName'].valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.mentoredNameText = value;

      if (this.mentoredNameText.length >= 3 || this.mentoredNameText.length == 0) {
        if (this.paginator) this.paginator.pageIndex = 0;

        this.load();
      }
    });

    // Award
    this.form.controls['awardName'].valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.awardNameText = value;

      if (this.awardNameText.length >= 3 || this.awardNameText.length == 0) {
        if (this.paginator) this.paginator.pageIndex = 0;

        this.load();
      }
    });
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
    this.status = listaEnumSentType();
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
    this.load();
  }

  load() {
    this.loading = true;
    this._sentService.get(
      this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? parseInt(this.paginatorHelper.PageSize),
      this.customerNameText,
      this.mentoredNameText,
      this.awardNameText,
      this.filterStatus
    )
      .toPromise()
      .then((ret) => {
        this.dataSource.data = ret.content;
        this.sents = [];
        // this.status = [];
        this.mentoreds = [];
        this.awards = [];
        // Carrega os selects dos filtros
        ret.content.forEach(item => {
          if (this.sents.findIndex(f => f.id == item.customerId) < 0)
            this.sents.push(new DropDownModel(item.customerId, item.customerName));

          if (this.mentoreds.findIndex(f => f.id == item.mentoredId) < 0)
            this.mentoreds.push(new DropDownModel(item.mentoredId, item.mentoredName));

          if (this.awards.findIndex(f => f.id == item.awardId) < 0)
            this.awards.push(new DropDownModel(item.awardId, item.awardName));

          // if (!this.status.includes(item.statusDescription))
          //   this.status.push(item.statusDescription);

          item.dateRequestExport = this._datePipe.transform(item.dateRequest?.toString(), 'dd/MM/yyyy');
          item.dateSendExport = this._datePipe.transform(item.dateSend?.toString(), 'dd/MM/yyyy');
          item.dateReceivingExport = this._datePipe.transform(item.dateReceiving?.toString(), 'dd/MM/yyyy');
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
    this._navigationService.sentNew();
  }

  edit(model: SentModel) {
    this._navigationService.sentEdit(model.id);
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: SentModel) => {

      let filterCustomer = () => {
        return this.filterCustomerValue == null || this.filterCustomerValue == 0 ? true : data.customerId == this.filterCustomerValue;
      };

      let filterMentored = () => {
        return this.filterMentoredValue == null || this.filterMentoredValue == 0 ? true : data.mentoredId == this.filterMentoredValue;
      };

      let filterAward = () => {
        return this.filterAwardValue == null || this.filterAwardValue == 0 ? true : data.awardId == this.filterAwardValue;
      };

      // let filterStatus = () => {
      //   return this.filterStatus == null || this.filterStatus == ""
      //     ? true
      //     : data.statusDescription == this.filterStatus;
      // };

      return filterCustomer() && filterMentored() && filterAward();
    };
  }

}
