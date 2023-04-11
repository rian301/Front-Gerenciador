export class ConfirmationModel {
    title: string = null;
    subTitle: string = null;
    placeholder: string = null;
    hasMotive: boolean = false;
    confirm: boolean = false;
    motive: string = null;
    hasCheckBox: boolean = false;
    textCheckBox: string = null;

    confirmOrCancel: boolean = true;
    valueCheckBox: boolean = true;

    constructor(title: string, subTitle: string, placeholder: string, motive: string, hasMotive: boolean, hasCheckBox: boolean, textCheckBox: string, confirm: boolean, valueCheckBox: boolean) {
        this.title = title;
        this.subTitle = subTitle;
        this.placeholder = placeholder;
        this.motive = motive;
        this.hasMotive = hasMotive;
        this.confirm = confirm;
        this.hasCheckBox = hasCheckBox;
        this.textCheckBox = textCheckBox;
        this.valueCheckBox = valueCheckBox;
    }
}