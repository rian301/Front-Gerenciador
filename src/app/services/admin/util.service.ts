import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormArray } from '@angular/forms';

@Injectable()
export class UtilService {

  constructor(
    private _snackBar: MatSnackBar) {
  }

  TratarErrorRequest(response: HttpErrorResponse) {
    if (response.error != null && typeof response.error === "object" && Object.keys(response.error)[0] == 'erros') {
      var i = (<any[]>response.error.erros).length;
      if (i > 1) {
        var mensagens = '';
        (<any[]>response.error.erros).forEach(x => mensagens += `<p>${x.mensagem}</p>`);
      }
      else
        this._snackBar.open((<any[]>response.error.erros)[0].mensagem, 'Fechar', { duration: 10000 });
    }
  }

  IsNullObject(obj: any) {
    return obj == null;
  }

  IsNullOrEmpty(string: string) {
    if (string == null)
      return true;

    if (string.trim() == '')
      return true;

    if (string == undefined)
      return true;

    return false;
  }

  FormValidate(form: FormGroup) {
    Object.keys(form.controls).forEach((campo) => {
      const controle = form.get(campo);
      controle.markAsDirty();
      if (controle instanceof FormGroup) {
        this.FormValidate(controle);
      }
      else if (controle instanceof FormArray) {
        (controle as FormArray).controls.forEach(ctrl => this.FormValidate(<FormGroup>ctrl));
      }
    });
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;

    return <File>theBlob;
  }
}
