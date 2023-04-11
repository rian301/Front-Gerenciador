import { Component, OnInit } from '@angular/core';
import { AutenticacaoService, NavigationService } from '../../../services';
import { AdminService } from '../../../services/admin/admin.service';
import { Init } from 'src/app/_config';
import { Menu } from 'src/app/_config/models/_index';
import { AppService } from 'src/app/services/admin/app.service';
import { UserModel } from 'src/app/models';
import { UserService } from 'src/app/services/admin/user.service';

@Component({
  selector: 'app-navbar-header',
  templateUrl: './navbar-header.component.html',
  styleUrls: ['./navbar-header.component.scss']
})

export class NavbarHeaderComponent implements OnInit {

  desktopMode: boolean = true;
  isLockScreen: boolean = false;
  username: string = null;

  menuItens: Menu[] = [];
  menus: Menu[] = [];
  isLoading: boolean;

  logo: string;
  imgUserDefault: string;

  constructor(
    private _init: Init,
    private _adminService: AdminService,
    private _autenticacaoService: AutenticacaoService,
    private _appService: AppService,
    private _usuarioService: UserService,
    private _navigationService: NavigationService,
  ) {
    this.logo = _init.configuracaoInicial.horizontal;
    this.imgUserDefault = _init.configuracaoInicial.imgUserDefault;
    this.username = this._adminService.getUsername();
    this.menus = this._init.menusLogadoAdmin;

  }

  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.desktopMode = false;
    }

    window.onresize = () => {
      if (window.innerWidth <= 768) {
        this.desktopMode = false;
      }
      else {
        this.desktopMode = true;
      }
    }


    this._appService.loading.subscribe((resp: boolean) => this.isLoading = resp);

    this._autenticacaoService.atualizarImagemENomeUsuario.subscribe((usuario: UserModel) => {
      this.username = usuario.nome;
    });
  }

  MenuToggle() {
    if (this._adminService.menuIsOpened)
      this._adminService.menuIsOpened = false;
    else
      this._adminService.menuIsOpened = true;
  }

  UserMenuToggle() {
    if (this._adminService.userMenuIsOpened)
      this._adminService.userMenuIsOpened = false;
    else
      this._adminService.userMenuIsOpened = true;
  }

  Lockscreen(state: boolean) {
    this.isLockScreen = state;
    this._adminService.lockscreen = state;
  }

  logout() {
    this._autenticacaoService.RemoverSessao();
  }
}
