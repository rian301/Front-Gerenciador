import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MatSelectChange, MatSnackBar, MAT_DIALOG_DATA } from 'src/app/app.material';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { AwardModel } from 'src/app/models/award.model';
import { CustomerAwardModel } from 'src/app/models/customer-award.model';
import { UtilitariosService } from 'src/app/services';
import { AwardService } from 'src/app/services/admin/award.service';
import { CustomerAwardService } from 'src/app/services/admin/customer-award.service';
import { UtilService } from 'src/app/services/admin/util.service';

@Component({
  selector: 'app-customer-award',
  templateUrl: './customer-award.component.html',
  styleUrls: ['./customer-award.component.scss']
})
export class CustomerAwardComponent extends OnDestroySubscriptions implements OnInit {
  form: FormGroup;
  startDate = new Date(2021, 0, 1);
  id: number = null;
  title: string = "Novo Pêmio";
  awards: AwardModel[] = [];
  loading: boolean = false;
  productId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CustomerAwardModel,
    private _dialogRef: MatDialogRef<CustomerAwardComponent>,
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _service: CustomerAwardService,
    private _utilitariosService: UtilitariosService,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _awardService: AwardService,
  ) {
    super();

    this.form = this._formbuilder.group(new CustomerAwardModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["dateReceiving"].clearValidators();
    this.form.controls["note"].clearValidators();
    this.form.controls["dateDevolution"].clearValidators();
    this.form.controls["dateResend"].clearValidators();
    this.form.controls["code"].clearValidators();
  }

  ngOnInit(): void {        
    this.loadAwards();
    if (this.data.id != null)
      this.load();

    if (this.data.customerId != null){}
      this.form.controls.customerId.setValue(this.data.customerId);
  }

  loadAwards() {
    this.loading = true;
    this._awardService
      .get()
      .toPromise()
      .then((resp: AwardModel[]) => {
        this.loading = false;
        this.awards = resp;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  load() {
    this._service.findAwardByCustomerById(this.data.customerId, this.data.id)
      .toPromise()
      .then((ret) => {
        this.form.patchValue(ret);
        this.title = "Editar Produto";
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  save() {
    if (!this.form.valid) {
      this._utilService.FormValidate(this.form);
      return;
    }
    this.loading = true;
    this._service.save(this.form.value)
      .toPromise()
      .then((resp: CustomerAwardModel) => {
        if (resp != null) {
          this.loading = false;
          this._snackBar.open(this.form.controls.id.value > 0 ? `Informações atualizada com sucesso!` : `Informações salvas com sucesso!`);
          this._dialogRef.close(resp);
        }
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  awardSelect(item: MatSelectChange) {    
    if (item.value != null) {
      this.form.controls.name?.setValue(this.awards[item.value-1]?.name);
      this.form.controls.productId?.setValue(this.awards[item.value-1]?.id);
    }
  }

  cancel() {
    this._dialogRef.close();
  }
}
