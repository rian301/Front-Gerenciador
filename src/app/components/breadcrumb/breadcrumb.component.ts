import { Component, OnInit } from '@angular/core';
import { Init } from 'src/app/_config';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumb: string;

  constructor(
    private _init: Init,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.gerarBreadcrumb(this._router.url);

    this._router.events.subscribe((resp: NavigationStart) => {
      if (resp instanceof NavigationStart)
        this.gerarBreadcrumb(resp.url);
    });
  }

  gerarBreadcrumb(url: string) {
    this.breadcrumb = "";

    url = url.replace("/painel/", "");

    if (url.indexOf("cadastro/") > -1 && url.indexOf("novo") == -1)
      this.breadcrumb = `${url.split("/")[0][0]?.toUpperCase() + url.split("/")[0].substr(1).toLowerCase()}s / `;
    else if (url.indexOf("/novo") > -1) {
      if (url.indexOf('/novo/') > -1)
        this.breadcrumb = "Edição";
      else {
        url = url.replace("/novo", "");
        this.breadcrumb = `${url.split("/")[0][0]?.toUpperCase() + url.split("/")[0].substr(1).toLowerCase()} / `;
      }
    }

    let menu = this._init.menus.find(x => x.url == url);
    if (menu)
      this.breadcrumb += menu.name;
    else {
      this._init.menus.forEach(menu => {
        let resp = menu.submenus.find(x => x.url == url);
        if (resp != null)
          this.breadcrumb += resp.name;
      });
    }
  }

}
