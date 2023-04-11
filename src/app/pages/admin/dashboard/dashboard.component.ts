import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardModel } from 'src/app/models/dashboard.model';
import { NavigationService } from 'src/app/services';
import { DashBordService } from 'src/app/services/admin/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboard: DashboardModel;

  constructor(
    private _dashBordService: DashBordService,
    private _navigationService: NavigationService,
    private _router: Router,
  ) {
  }

  ngOnInit(): void {
    this.getDashborad();
  }

  getDashborad() {
    this._dashBordService.getDashborad()
      .toPromise()
      .then((ret) => {
        this.dashboard = ret;
      });
  }

  // Navegação para os Customers
  navigateCustomerAll() {
    this._navigationService.customers();
  }

    // Navegação para os Lançamentos
    navigateLaunchAll() {
      this._navigationService.lauchList();
    }

    navigateProductAll() {
      this._navigationService.productList();
    }

    navigateAwardAll() {
      this._navigationService.awardList();
    }
}

