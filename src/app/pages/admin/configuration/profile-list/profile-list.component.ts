import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DinamicTableItemModel, DinamicTableModel } from 'src/app/components/dinamic-table/dinamic-table.model';
import { ProfileModel } from 'src/app/models/profile.model';
import { UtilitariosService } from 'src/app/services';
import { ProfileService } from 'src/app/services/admin/profile.service';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {

  source: DinamicTableModel;
  profilles: ProfileModel[] = [];

  constructor(
    private _profileService: ProfileService,
    private _dialog: MatDialog,
    private _utilitariosService: UtilitariosService
  ) { }

  ngOnInit(): void {
    this.obterLista();
  }

  obterLista() {
    this._profileService
      .get()
      .toPromise()
      .then((resp: ProfileModel[]) => {
        this.profilles = resp;
        this.source = new DinamicTableModel([new DinamicTableItemModel('name', 'Nome')], resp);
      })
      .catch(error => {
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  novo() {
    const dialogRef = this._dialog.open(ProfileComponent, { minWidth: '50%' });
    dialogRef.afterClosed().subscribe((result: ProfileModel) => this.obterLista());
  }

  editar(model: ProfileModel) {
    const dialogRef = this._dialog.open(ProfileComponent, { minWidth: '50%', data: model });
    dialogRef.afterClosed().subscribe((result: ProfileModel) => this.obterLista());
  }
}
