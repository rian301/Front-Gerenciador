import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from 'src/app/app.material';
import { PaginatorHelper } from 'src/app/helpers/paginator.helper';
import { DropDownModel } from 'src/app/models/dropdown.model';
import { PatrimonyModel } from 'src/app/models/patrimony.model';
import { NavigationService, UtilitariosService } from 'src/app/services';
import { PatrimonyService } from 'src/app/services/admin/patrimony.service';

@Component({
    selector: 'app-patrimony-list',
    templateUrl: './patrimony-list.component.html',
    styleUrls: ['./patrimony-list.component.scss'],
})
export class PatrimonyListComponent implements OnInit {
    // Paginação
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    paginatorHelper: typeof PaginatorHelper = PaginatorHelper;

    form: FormGroup;
    title: string = 'Patrimônios';
    displayedColumns: string[] = ['description', 'tag', 'categoryName', 'status', 'action'];
    columnsExport: string[] = ['description', 'tag', 'categoryName', 'statusDescription'];
    columnsExportName: string[] = ['Descroção', 'Tag', 'Categoria', 'Status'];
    dataSource = new MatTableDataSource();
    patrimonies: DropDownModel[] = [];
    situations: string[] = [];
    loading: Boolean = false;
    resultsLength: number = 0;
    filterStatus: string = '';
    filterPatrimonyValue: number;
    editLabel: string = "Editar";

    constructor(
        private _navigationService: NavigationService,
        private _formBuilder: FormBuilder,
        private _patrimonyService: PatrimonyService,
        private _utilitariosService: UtilitariosService,
    ) {
        this.form = this._formBuilder.group({
            search: null,
        });
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
        this._patrimonyService
            .get()
            .toPromise()
            .then((resp: PatrimonyModel[]) => {
                this.dataSource.data = resp;
                this.loading = false;
                this.patrimonies = [];
                this.situations = [];
                resp.forEach(item => {
                    if (this.patrimonies.findIndex(f => f.id == item.id) < 0) this.patrimonies.push(new DropDownModel(item.id, item.description));

                    if (!this.situations.includes(item.statusDescription)) this.situations.push(item.statusDescription);
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
        this._navigationService.patrimonyNew();
    }

    edit(model: PatrimonyModel) {
        this._navigationService.patrimonyEdit(model.id);
    }

    searchFilter() {
        this.dataSource.filter = Math.random().toString();
    }

    filterPredicate() {
        // filterPredicate É a função do matTable que pesquisa em todas as colunas.
        this.dataSource.filterPredicate = (data: PatrimonyModel) => {
            let filterMentored = () => {
                return this.filterPatrimonyValue == null || this.filterPatrimonyValue == 0 ? true : data.id == this.filterPatrimonyValue;
            };

            let filterStatus = () => {
                return this.filterStatus == null || this.filterStatus == '' ? true : data.statusDescription == this.filterStatus;
            };

            return filterMentored() && filterStatus();
        };
    }
}
