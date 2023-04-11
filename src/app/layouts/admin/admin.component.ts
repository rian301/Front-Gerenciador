import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/services';
import { SignalRService } from 'src/app/services/admin/signalr.service';
import { Init } from 'src/app/_config';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  subscriptions: Subscription = new Subscription();

  lockscreen: boolean = false;
  menuIsOpened: boolean = true;
  userMenuIsOpened: boolean = false;

  windowWidth: number = null;
  menuMode: string = 'side';

  constructor(
    private _adminService: AdminService,
    public signalRService: SignalRService,
    public init: Init) {
    this.subscriptions.add(
      this._adminService.changeMenuIsOpened.subscribe(
        value => this.menuIsOpened = value
      )
    );

    this.subscriptions.add(
      this._adminService.changeLockScreen.subscribe(
        value => this.lockscreen = value
      )
    );

    this.subscriptions.add(
      this._adminService.changeUserMenuIsOpened.subscribe(
        value => this.userMenuIsOpened = value
      )
    );

    // signalRService.init();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 768) {
      this._adminService.menuIsOpened = false;
      this.menuMode = 'over';
    }
    else {
      this._adminService.menuIsOpened = true;
      this.menuMode = 'side';
    }
  }

  ngOnInit() {
    this._adminService.menuIsOpened = true;

    if (window.innerWidth <= 768) {
      this._adminService.menuIsOpened = false;
      this.menuMode = 'over';
    }
  }

  MenuState(state: boolean) {
    if (state) {
      this._adminService.menuIsOpened = true;
    }
    else {
      this._adminService.menuIsOpened = false;
    }
  }

  UserMenuState(state: boolean) {
    if (state) {
      this._adminService.userMenuIsOpened = true;
    }
    else {
      this._adminService.userMenuIsOpened = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
