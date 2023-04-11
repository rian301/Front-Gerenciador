import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatSelectChange } from 'src/app/app.material';
import { AwardModel } from 'src/app/models/award.model';
import { CustomerAwardModel } from 'src/app/models/customer-award.model';
import { MentoredAwardModel } from 'src/app/models/mentored-award.model';
import { UtilitariosService } from 'src/app/services';
import { AwardService } from 'src/app/services/admin/award.service';
import { CustomerAwardService } from 'src/app/services/admin/customer-award.service';
import { MentoredAwardService } from 'src/app/services/admin/mentored-award.service';
import { UtilService } from 'src/app/services/admin/util.service';
import { CustomerAwardComponent } from '../../customer/customer-award/customer-award.component';

@Component({
  selector: 'app-mentored-award',
  templateUrl: './mentored-award.component.html',
  styleUrls: ['./mentored-award.component.scss']
})
export class MentoredAwardComponent implements OnInit {
  form: FormGroup;
  startDate = new Date(2021, 0, 1);
  id: number = null;
  title: string = "Novo Pêmio";
  awards: AwardModel[] = [];
  loading: boolean = false;
  productId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MentoredAwardModel,
    private _dialogRef: MatDialogRef<MentoredAwardComponent>,
    private _formbuilder: FormBuilder,
    private route: ActivatedRoute,
    private _service: MentoredAwardService,
    private _utilitariosService: UtilitariosService,
    private _utilService: UtilService,
    private _snackBar: MatSnackBar,
    private _awardService: AwardService,
  ) {

    this.form = this._formbuilder.group(new MentoredAwardModel());
    Object.keys(this.form.controls).forEach(prop => this.form.controls[prop].setValidators(Validators.required));
    this.form.controls["id"].clearValidators();
    this.form.controls["dateReceiving"].clearValidators();
    this.form.controls["note"].clearValidators();
  }

  ngOnInit(): void {        
    this.loadAwards();
    if (this.data.id != null)
      this.load();

    if (this.data.mentoredId != null){}
      this.form.controls.mentoredId.setValue(this.data.mentoredId);
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
    this._service.findAwardByMentoredById(this.data.mentoredId, this.data.id)
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
      .then((resp: MentoredAwardModel) => {
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
