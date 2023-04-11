import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { EmployeeModel } from 'src/app/models/employee.model.ts';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { EmployeeService } from 'src/app/services/admin/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent extends OnDestroySubscriptions implements OnInit {
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;

  title: string = "Colaboradores";
  dataSource = new MatTableDataSource();
  situations: string[] = [];
  types: string[] = [];
  employees: DropDownModel[] = [];
  statusFilter: string = null;
  typeFilter: string = null;
  dependentsPendingFilter: boolean = false;
  displayedColumns: string[] = [
    "name",
    "email",
    "status",
    "typeDescription",
    "action",
  ];
  columnsExport: string[] = [
    "name",
    "email",
    "function",
    "wage",
    "statusDescription",
    "typeDescription",
  ];
  columnsExportName: string[] = [
    "Nome",
    "E-mail",
    "Função",
    "Remuneração R$",
    "Status",
    "Tipo"
  ];
  loading: Boolean = false;
  resultsLength: number = 0;
  editLabel: string = "Editar";
  filterEmployeeValue: number;
  filterStatus: string;
  filterType: string;

  constructor(
    private _employeeService: EmployeeService,
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.loadList();
    this.filterPredicate();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.sort != null)
      this.sort.sortChange.subscribe(() => {
        if (this.paginator) this.paginator.firstPage();
      });
  }

  loadList() {
    this.loading = true;
    this._employeeService
      .get()
      .toPromise()
      .then((resp: EmployeeModel[]) => {
        this.dataSource.data = resp;
        this.loading = false;
        this.situations = [];
        this.employees = [];
        this.types = [];
        resp.forEach(item => {
          if (this.employees.findIndex(f => f.id == item.id) < 0) this.employees.push(new DropDownModel(item.id, item.name));

          if (!this.types.includes(item.typeDescription))
            this.types.push(item.typeDescription);

          if (!this.situations.includes(item.statusDescription))
            this.situations.push(item.statusDescription);
        });
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  new() {
    this._navigationService.employeeNew();
  }

  edit(model: EmployeeModel) {
    this._navigationService.employeeEdit(model.id);
  }

  searchFilter() {
    this.dataSource.filter = Math.random().toString();
  }

  filterPredicate() {
    // filterPredicate É a função do matTable que pesquisa em todas as colunas.
    this.dataSource.filterPredicate = (data: EmployeeModel) => {
      let filterEmployee = () => {
        return this.filterEmployeeValue == null || this.filterEmployeeValue == 0 ? true : data.id == this.filterEmployeeValue;
      };

      let filterStatus = () => {
        return this.filterStatus == null || this.filterStatus == '' ? true : data.statusDescription == this.filterStatus;
      };

      let filterType = () => {
        return this.filterType == null || this.filterType == '' ? true : data.typeDescription == this.filterType;
      };

      return filterEmployee() && filterStatus() && filterType();
    };
  }
}
