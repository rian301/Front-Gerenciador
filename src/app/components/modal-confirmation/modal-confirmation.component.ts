import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange, MatDialogRef, MAT_DIALOG_DATA } from 'src/app/app.material';
import { UtilService } from 'src/app/services/admin/util.service';
import { ConfirmationModel } from './modal-confirmation.model';

@Component({
    selector: 'app-modal-confirmation',
    templateUrl: './modal-confirmation.component.html',
    styleUrls: ['./modal-confirmation.component.scss']
})

export class ModalConfirmationComponent implements OnInit {
    form: FormGroup;
    @Input()
    title: string = null;
    @Input()
    subTitle: string = null;
    @Input()
    placeholder: string = null;
    @Input()
    hasMotive: boolean = false;
    @Input()
    hasCheckBox: boolean = false;
    @Input()
    textCheckBox: string = null;

    confirmOrCancel: boolean = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationModel,
        private _formbuilder: FormBuilder,
        private _dialogRef: MatDialogRef<ModalConfirmationComponent>,
        private _utilService: UtilService
    ) {
    }

    ngOnInit() {
        this.form = this._formbuilder.group({
            motive: [null],
            valueCheckBox: [false]
        });

        this.title = this.data?.title;
        this.subTitle = this.data?.subTitle;
        this.placeholder = this.data?.placeholder;
        this.hasMotive = this.data?.hasMotive;
        this.hasCheckBox = this.data?.hasCheckBox;
        this.textCheckBox = this.data?.textCheckBox;
    }

    checkBox(checkboxRef: MatCheckboxChange) {
        if (checkboxRef.checked)
            this.form.controls.valueCheckBox.setValue(true);
        else
        this.form.controls.valueCheckBox.setValue(false);
    }

    save() {
        this.confirmOrCancel = true;
        if (!this.form.valid) {
            this._utilService.FormValidate(this.form);
            return;
        }

        var obj = new ConfirmationModel(
            this.title,
            this.subTitle,
            this.placeholder,
            this.form.value.motive,
            this.hasMotive,
            this.hasCheckBox,
            this.textCheckBox,
            this.confirmOrCancel,
            this.form.value.valueCheckBox,
        );

        this._dialogRef.close(obj);
    }

    cancel() {
        this.confirmOrCancel = false;
        this._dialogRef.close();
    }
}
