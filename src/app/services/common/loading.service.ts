import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class LoadingService {

  changeLoginLoading: EventEmitter<boolean>;

  private _loginLoading: boolean = false;
  get loginLoading() { return this._loginLoading; }
  set loginLoading(value: boolean) {
    if (value != this._loginLoading) {
      this.changeLoginLoading.emit(value);
      this._loginLoading = value;
    }
  }

  constructor() { 
    this.changeLoginLoading = new EventEmitter<boolean>();
  }

}
