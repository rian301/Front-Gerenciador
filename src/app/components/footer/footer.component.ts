import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Init } from 'src/app/_config';
import { Menu } from 'src/app/_config/models/_index';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input()
  isAdminPage: boolean = false;

  menuItems: Menu[] = [];
  socialItems: Menu[] = [];

  constructor(
    private _http: HttpClient,
    private _init: Init) { }

  ngOnInit() {
    this.GetMenuItens();

    this.GetSocialItens();
  }

  GetMenuItens() {
    this.menuItems = this._init.footerMenus;
  }

  GetSocialItens() {
    this.socialItems = this._init.socials;
  }

}
