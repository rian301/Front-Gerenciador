import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DinamicTableItemModel, DinamicTableModel } from 'src/app/components/dinamic-table/dinamic-table.model';
import { UserModel } from 'src/app/models';
import { UserService } from 'src/app/services/admin/user.service';
import { UserChangePasswordComponent } from '../user-change-password/user-change-password.component';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  source: DinamicTableModel;
  users: UserModel[] = [];

  constructor(
    private _userService: UserService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obterLista();
  }

  obterLista() {
    this._userService
      .get()
      .toPromise()
      .then((resp: UserModel[]) => {
        this.users = resp;
        this.source = new DinamicTableModel([new DinamicTableItemModel('name', 'Nome'), new DinamicTableItemModel('email', 'E-mail'), new DinamicTableItemModel('active', 'Status')], resp);
      });
  }

  novo() {
    const dialogRef = this._dialog.open(UserComponent, { minWidth: '50%' });
    dialogRef.afterClosed().subscribe((result: UserModel) => this.obterLista());
  }

  editar(item: UserModel) {
    const dialogRef = this._dialog.open(UserComponent, { minWidth: '50%', data: item });
    dialogRef.afterClosed().subscribe((result: UserModel) => this.obterLista());
  }

  trocarSenha(item: UserModel) {
    const dialogRef = this._dialog.open(UserChangePasswordComponent, { minWidth: '50%', data: item });
    dialogRef.afterClosed().subscribe((result: UserModel) => this.obterLista());
  }
}
