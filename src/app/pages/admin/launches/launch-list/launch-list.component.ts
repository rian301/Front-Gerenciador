import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from 'src/app/app.material';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { PermissionHelper } from 'src/app/helpers/permission.helper';
import { LaunchModel } from 'src/app/models/launch.model';
import { UtilitariosService, NavigationService } from 'src/app/services';
import { LaunchService } from 'src/app/services/admin/launcher.service';

@Component({
  selector: 'app-launch-list',
  templateUrl: './launch-list.component.html',
  styleUrls: ['./launch-list.component.scss']
})
export class LaunchListComponent implements OnInit {
  // Paginação
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorHelper: typeof PaginatorHelper = PaginatorHelper;

  displayedColumnsLanch: string[] = ['description', 'date', 'investment', 'invoice', 'quantityStudents', 'action'];
  dataSource = new MatTableDataSource();
  matTableRef: MatTableDataSource<any>;
  statusFilter: string;
  filterBusinessValue: number;
  filterPeriodValue: number;
  situations: string[] = [];
  periods: any[] = [];

  loading: boolean = false;

  constructor(
    private _utilitariosService: UtilitariosService,
    private _navigationService: NavigationService,
    private _route: ActivatedRoute,
    private _lauchService: LaunchService,
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
      this.getLauncher();
  }

  getLauncher() {
    this.loading = true;
    this._lauchService.getLaunch()
      .toPromise()
      .then((ret) => {
        this.loading = false;
        if (ret.length >= 1) {
          this.dataSource.data = ret;
        }
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }


  new() {
    this._navigationService.lauchNew();
  }

  edit(model: LaunchModel) {    
    this._navigationService.lauchEdit(model.id);
  }

  searchFilter(filterValue: string) {
    if (filterValue.length >= 2)
      this.dataSource.filter = filterValue.trim().toLowerCase();
    else
      this.dataSource.filter = "";
  }

  filterSituation(filterValue: string) {
    this.matTableRef.filter = filterValue.trim().toLowerCase();
  }

  imprimir(tableRef: any) {
    tableRef.imprimir();
  }
}
