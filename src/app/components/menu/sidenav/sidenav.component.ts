import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Init } from 'src/app/_config';
import { Menu } from 'src/app/_config/models/_index';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  panelOpenState: boolean = false;
  menuItens: Menu[] = [];
  contador: number = 0;
  version: string = null;

  constructor(
    private _init: Init,
    private _router: Router
  ) { }

  ngOnInit() {
    this.verificarRota();
  }

  verificarRota() {
    this.GetMenuItens();

    this.isLinkActive(this._router.url.replace('/', ''));
    this.sobrescreverRota();
  }

  sobrescreverRota() {
    this._router.events.subscribe((rota: NavigationEnd) => {
      if (rota instanceof NavigationEnd)
        this.isLinkActive(rota.url.replace('/', ''));
    })
  }

  isLinkActive(itemRota: string) {
    this.menuItens.forEach(menu => {
      menu.active = false;
      if (menu.submenus.length > 0)
        menu.submenus.forEach(sub => {
          sub.active = false;
        });
    });

    let menuRecuperado = this.menuItens.find(x => x.url != null ? x.url.indexOf(itemRota.split('/')[0]) > -1 : null);

    if (menuRecuperado)
      menuRecuperado.active = true;
    else {
      let menuPai;

      this.menuItens.forEach(menu => {
        if (menu.submenus.filter(x => x.url != null ? x.url.indexOf(itemRota.split('/')[0]) > -1 : null).length > 0)
          menuPai = menu;
      });

      if (menuPai) {
        if (!menuPai.expanded)
          menuPai.expanded = true;

        menuPai.active = true;
      }

      if (menuPai != null && menuPai != undefined && menuPai.submenus != null && menuPai.submenus != undefined && menuPai.submenus.length > 0) {
        let menuRecuperado = menuPai.submenus.find(x => x.url != null ? x.url.indexOf(`${itemRota.split('/')[0]}/${itemRota.split('/')[1]}`) > -1 : null);
        if (menuRecuperado)
          menuRecuperado.active = true;
      }
    }
  }

  GetMenuItens() {
    this.menuItens = JSON.parse(JSON.stringify(this._init.menus));
  }

}
