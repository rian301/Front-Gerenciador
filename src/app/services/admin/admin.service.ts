import { Injectable, EventEmitter } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AdminService {

  changeLockScreen: EventEmitter<boolean>;
  changeMenuIsOpened: EventEmitter<boolean>;
  changeUserMenuIsOpened: EventEmitter<boolean>;

  private _lockscreen : boolean = false;
  public get lockscreen() : boolean {
    return this._lockscreen;
  }
  public set lockscreen(value : boolean) {
    this.changeLockScreen.emit(value);
    this._lockscreen = value;
  }

  private _menuIsOpened: boolean = true;
  get menuIsOpened() {
    return this._menuIsOpened;
  }
  set menuIsOpened(value: boolean) {
    if (value != this._menuIsOpened) {
      this.changeMenuIsOpened.emit(value);
      this._menuIsOpened = value;
    }
  }

  private _userMenuIsOpened : boolean = false;
  public get userMenuIsOpened() : boolean {
    return this._userMenuIsOpened;
  }
  public set userMenuIsOpened(value : boolean) {
    this.changeUserMenuIsOpened.emit(value);
    this._userMenuIsOpened = value;
  }

  constructor(
    private _cookieService: CookieService
  ) {
    this.changeLockScreen = new EventEmitter<boolean>();
    this.changeMenuIsOpened = new EventEmitter<boolean>();
    this.changeUserMenuIsOpened = new EventEmitter<boolean>();
  }

  getUsername() {
    return this._cookieService.get('name');
  }

  getAccountId() {
    return parseInt(this._cookieService.get('account_id'));
  }

}
