import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from 'src/app/_config/models/_index';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    @Input()
    appName: string = null;

    showMenu: boolean = false;

    panelOpenState: boolean = false;
    menuItens: Menu[] = [];

    constructor(
        private _http: HttpClient,
        private _activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {

        this.GetMenuItens().subscribe(
            data => {
                this.CheckItem(data);
                this.menuItens = data
            },
            error => { console.error(error) },
            () => { }
        );
    }

    CheckItem(itens: Menu[]) {
        var retorno = false;
        itens.forEach(menu => {
            if (!retorno) {
                if (this.isLinkActive(menu.url)) {
                    menu.expanded = true;
                    retorno = true;
                }
                else if (menu.submenus != undefined && menu.submenus != null && menu.submenus.length > 0) {
                    retorno = this.CheckItem(menu.submenus);
                    menu.expanded = retorno;
                }
                else {
                    menu.expanded = false;
                    retorno = false;
                }
            }
        });

        return retorno;
    }

    isLinkActive(url: string): boolean {
        var compare = window.location.hash.replace('#/', '');
        return (compare === url);
    }

    GetMenuItens() {
        return this._http.get<Menu[]>('assets/config/navbar.json');
    }

    resetDemo() {
        window.location.reload();
    }
}
