import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services';
import { Router } from '@angular/router';
import { Init } from 'src/app/_config';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  loading: boolean = false;
  subscriptions: Subscription = new Subscription();

  logo: string;
  icon: string;
  spinner: any[] = [
    {
      color: "warn",
      mode: "indeterminate",
      value: "50"
    }
  ]

  constructor(
    private _init: Init,
    private _loadingService: LoadingService,
    public _router: Router
  ) {
    this.logo = _init.configuracaoInicial.vertical;
    this.icon = _init.configuracaoInicial.icon;
    this.subscriptions.add(
      this._loadingService.changeLoginLoading.subscribe(
        value => this.loading = value
      )
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
