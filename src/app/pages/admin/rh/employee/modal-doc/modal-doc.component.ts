import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from 'src/app/app.material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilitariosService } from 'src/app/services';
import { OnDestroySubscriptions } from 'src/app/helpers/detroy-subscriptions.helper';
import { DependentDocTypeEnumList } from 'src/app/enums/dependent-doc-type.enum';
import { EmployeeService } from 'src/app/services/admin/employee.service';

@Component({
    selector: 'app-modal-doc',
    templateUrl: './modal-doc.component.html',
    styleUrls: ['./modal-doc.component.scss'],
})
export class ModalDocComponent extends OnDestroySubscriptions implements OnInit {
    docTypes = DependentDocTypeEnumList();
    form: FormGroup;
    loading: boolean = false;
    filterPeriodValue: any;
    companyId: number = null;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef: MatDialogRef<ModalDocComponent>,
        private _formBuilder: FormBuilder,
        private _utilitariosService: UtilitariosService,
        private _employeeService: EmployeeService,
    ) {
        super();
    }
    ngOnInit(): void {
        this.form = this._formBuilder.group({
            typeDoc: [1, [Validators.required]],
            files: ['', [Validators.required]],
            mentoredCompanyId: [null],
        });

        this.subscriptions.add(
            this.form.controls.typeDoc.valueChanges.subscribe(value => {
                this.form.controls.files.clearValidators();
                this.form.controls.files.updateValueAndValidity();
            }),
        );
    }

    save() {
        if (!this.form.valid) {
            this._utilitariosService.SnackAlert('Verifique os campos obrigatórios para prosseguir.', 'error');
            return;
        }
        this.loading = true;
        const type = this.form.controls.typeDoc.value.toString();
        const files = this.form.controls.files.value;

        let formData = new FormData();
        formData.append('type', type);

        for (var i = 0; i <= files.files.length; i++) {
            formData.append('type', type);
            formData.append('files', files.files[i]);
        }

        this._employeeService
            .uploadDoc(this.data.id, formData)
            .toPromise()
            .then(ret => {
                this.loading = false;
                this._utilitariosService.SnackAlert('Documento salvo com sucesso.', 'success');
                this._dialogRef.close(ret);
            })
            .catch(error => {
                this.loading = false;
                this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
                    this._utilitariosService.SnackAlert(msg, 'error');
                });
            });
    }
}
