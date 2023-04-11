import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, HostListener, AfterContentInit } from '@angular/core';
import { PdfService } from '../pdf/pdf.service';
import { Router } from '@angular/router';
import { Init } from 'src/app/_config';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import '@fortawesome/fontawesome-free/js/all.js';
import { DinamicTableItemModel, DinamicTableModel } from './dinamic-table.model';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-dinamic-table',
  templateUrl: './dinamic-table.component.html',
  styleUrls: ['./dinamic-table.component.scss']
})

export class DinamicTableComponent implements AfterContentInit {
  columnsToDisplay: string[] = [];
  pageSizeOptions: number[] = [];
  data: DinamicTableModel[] = [];
  linkRouter: string = null;
  pageEvent: PageEvent;
  pageSize: number = 10;
  length: number = null;
  contador: number = 0;
  loading: boolean = true;
  empty: boolean = false;
  value: DinamicTableModel;
  ids: number[] = [];

  @Input()
  dataSource: MatTableDataSource<DinamicTableModel> = new MatTableDataSource<DinamicTableModel>();

  @Input()
  showSearch: boolean = true;

  @Input()
  showId: boolean = false;

  @Input()
  canPrint: boolean = true;

  @Input()
  canShowActions: boolean = false;

  @Input()
  public set source(value: DinamicTableModel) {
    if (value) {

      if (this.canActive)
        value.titles.push(new DinamicTableItemModel('permitido', 'Permitido'));

      if (this.canShowActions)
        value.titles.push(new DinamicTableItemModel('acoes', 'Ações'));

      this.columnsToDisplay = value.titles.map(x => x.alias);
      this.dataSource = new MatTableDataSource(value.lista);
      this.customFilter.emit(this.dataSource);
      this.length = value.lista.length;
      this.pageSizeOptions = [5, 10, 25, 100];
      this.value = value;
      this.initTableFeatures();
    }
    else {
      this.dataSource = new MatTableDataSource([]);
      this.customFilter.emit(this.dataSource);
      this.loading = true;
    }
  }

  @Input()
  canShowCustomTextButton: boolean = false;
  @Input()
  customTextButtonName: string = "";

  @Input()
  canShowInit: boolean = false;

  @Input()
  useEyedIcon: boolean = false;

  @Input()
  userEditIcon: boolean = false;

  @Input()
  clickable: boolean = false;

  @Input()
  canActive: boolean = false;

  @Input()
  canDelete: boolean = false;

  @Input()
  canChangePassword: boolean = false;

  @Output()
  rowID: EventEmitter<any>;

  @Output()
  statusChange: EventEmitter<DinamicTableItemModel> = new EventEmitter<DinamicTableItemModel>();

  @Output()
  isEditing: EventEmitter<DinamicTableItemModel> = new EventEmitter<DinamicTableItemModel>();

  @Output()
  isInit: EventEmitter<DinamicTableItemModel> = new EventEmitter<DinamicTableItemModel>();

  @Output()
  isCustomButton: EventEmitter<DinamicTableItemModel> = new EventEmitter<DinamicTableItemModel>();

  @Output()
  isChangePassword: EventEmitter<DinamicTableItemModel> = new EventEmitter<DinamicTableItemModel>();

  @Output()
  isRemoving: EventEmitter<DinamicTableItemModel> = new EventEmitter<DinamicTableItemModel>();

  @Output()
  customFilter: EventEmitter<MatTableDataSource<any>> = new EventEmitter<MatTableDataSource<any>>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _pdfService: PdfService,
    private _route: Router,
    private _init: Init
  ) {
    this.rowID = new EventEmitter<any>();
  }

  ngAfterContentInit() {
    if (this.sort != null)
      this.sort.sortChange.subscribe(() => {
        if (this.paginator)
          this.paginator.pageIndex = 0;
      });
    this.initTableFeatures();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.empty = this.dataSource.filteredData.length == 0;
  }

  emitirStatus(item: DinamicTableItemModel) {
    this.statusChange.emit(item);
  }

  canShowImage(url: string): boolean {
    if (/\.(jpe?g|png|gif|bmp)$/i.test(url))
      return true;
  }

  canShowVideo(url: string): boolean {
    if (/\.(mp4)$/i.test(url))
      return true;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(",").map(str => +str);
  }

  alterarSenha(item: DinamicTableItemModel) {
    this.isChangePassword.emit(item);
  }

  editar(item: DinamicTableItemModel) {
    this.isEditing.emit(item);
  }

  iniciar(item: DinamicTableItemModel) {
    this.isInit.emit(item);
  }

  customTextButtonClick(item: DinamicTableItemModel) {
    this.isCustomButton.emit(item);
  }

  remover(item: DinamicTableItemModel) {
    this.isRemoving.emit(item);
  }

  initTableFeatures() {
    this.loading = this.length == null;
    this.empty = this.length == 0;

    if (this.canActive) {
      let newHeader = JSON.parse(JSON.stringify(this.columnsToDisplay));
      newHeader.filter(x => x === "Permitido").length < 1 ? newHeader.push("Permitido") : false;
      this.columnsToDisplay = newHeader;
    }

    if (this.canShowActions) {
      let newHeader = JSON.parse(JSON.stringify(this.columnsToDisplay));
      newHeader.filter(x => x === "Ações").length < 1 ? newHeader.push("Ações") : false;
      this.columnsToDisplay = newHeader;
    }

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setColor(value) {
    if (typeof (value) != 'boolean') {
      return '';
    }
    else {
      if (value)
        return 'green';
      else
        return 'red';
    }
  }

  lineClicked(element) {
    if (this.clickable) {
      return this.rowID.emit(element);
    }
    else {
      return false;
    }
  }

  addColumn() {
    const randomColumn = Math.floor(Math.random() * this.columnsToDisplay.length);
    this.columnsToDisplay.push(this.columnsToDisplay[randomColumn]);
  }

  removeColumn() {
    if (this.columnsToDisplay.length) {
      this.columnsToDisplay.pop();
    }
  }

  getRow(index: number, column: string) {
    return (`element.lista[${index}].${column}`);
  }

  getColumnName(index: number): string {
    return this.value.titles[index].prop;
  }

  shuffle() {
    let currentIndex = this.columnsToDisplay.length;
    while (0 !== currentIndex) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap
      let temp = this.columnsToDisplay[currentIndex];
      this.columnsToDisplay[currentIndex] = this.columnsToDisplay[randomIndex];
      this.columnsToDisplay[randomIndex] = temp;
    }
  }

  sortData(sort: MatSort) {
    if (!this.empty) {
      sort.active = this.value.titles.find(x => x.alias == sort.active).prop;
      this.dataSource.filteredData = this.dataSource.sortData(this.dataSource.filteredData, sort);
    }
  }

  setPaginatorSize(size: number) {
    if (size == undefined)
      this.pageSize = 10;
    else
      this.pageSize = size;

    return this.pageSize;
  }

  imprimir() {
    var titles = [];
    var values = [];

    var tableTitle = `Lista de ${this.tratarTitulo()}`;
    titles = JSON.parse(JSON.stringify(this.columnsToDisplay));
    values = JSON.parse(JSON.stringify(this.dataSource.filteredData));

    if (this.canActive)
      titles.splice(titles.indexOf(titles.find(x => x.prop == 'permitido')), 1);

    if (this.canShowActions)
      titles.splice(titles.indexOf(titles.find(x => x.prop == 'acoes')), 1);

    var newValues = [];
    values.forEach(value => {
      var row = [];
      this.value.titles.forEach(title => {
        if (value[title.prop] != null && value[title.prop] != undefined) {
          if (value[title.prop] == true && title.alias == "Status")
            row.push('Ativo');
          else if (value[title.prop] == false && title.alias == "Status")
            row.push('Inativo');
          else
            row.push([value[title.prop]])
        }
      });
      newValues.push(row);
    });

    this._pdfService.generateTablePdf(titles, newValues, tableTitle);
  }

  tratarTitulo(): string {
    var title = "";
    var obj = this._init.menus.find(x => x.url == this._route.url.replace("/painel/", ""));

    if (obj != null)
      title = obj.name;
    else {
      this._init.menus.forEach(menu => {
        var obj = menu.submenus.find(x => x.url == this._route.url.replace("/painel/", ""));

        if (obj != null)
          title = obj.name;
      });
    }

    return title;
  }
}
