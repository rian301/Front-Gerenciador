import { Component, OnInit } from '@angular/core';
import { AutenticacaoService, AdminService } from 'src/app/services';
import { Init } from 'src/app/_config';
import { Menu } from 'src/app/_config/models/_index';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  menus: Menu[] = [];
  pageSelected: number = 0;
	pageName: string = null;

  constructor(
    private _autenticacaoService: AutenticacaoService,
    private _adminService: AdminService,
    private _init: Init,
  ) { }

  ngOnInit() {
    this.menus = this._init.menusLogadoAdmin;
  }

  ShowMenu(page: number = 0, pageName: string = null) {
		this.pageSelected = page;
		this.pageName = pageName;
	}

	closeMenu() {
		this._adminService.userMenuIsOpened = false;
		this.ShowMenu();
	}

  logout() {
    this._autenticacaoService.RemoverSessao();
  }

}
