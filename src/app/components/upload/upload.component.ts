import { Component, ContentChild, Input, forwardRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { FormControlName, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSnackBar, MatDialog } from 'src/app/app.material';
import { UploadCropperComponent } from './upload-cropper/upload-cropper.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadComponent),
      multi: true,
    }
  ]
})
export class UploadComponent {

  temOpacidade: boolean = false;

  acceptedFileTypes: string[] = [
    'jpeg',
    'jpg',
    'png',
    'bmp',
    'gif',
    'webp'
  ]

  @ContentChild(FormControlName) control: FormControlName;
  @ViewChild("fileInput") fileInput;
  @ViewChild("menuTrigger") menuTrigger;
  @Input() url: string;
  @Input() icon: string;
  @Input() imageSize: number = 2;
  @Input() ehVideo: boolean = false;
  @Input() canCrop: boolean = false;
  @Input() canVideo: boolean = false;
  @Input() aspectRatio: number = 4 / 3;
  @Input() isCircle: boolean = false;
  @Input() size: number = 200;

  constructor(
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) { }

  changeFile(): void {
    if (!this.isValid()) {
      this.fileInput.nativeElement.click();
    } else {
      setTimeout(() => {
        this.menuTrigger.openMenu();
      }, 100);
    }
  }

  openFile(): void {
    this.fileInput.nativeElement.click();
  }

  removeFile(): void {
    this.url = null;
    this.fileInput.nativeElement.value = null;
    // Propagar a alteração
    this.propagateChange(this.url);
  }

  addFile(event: any): void {
    let possuiExt: boolean = false;
    this.acceptedFileTypes.forEach(ext => {
      if (event.target.value.indexOf(ext) > -1)
        possuiExt = true;
    });

    if (possuiExt && this.canCrop) {
      this.ehVideo = false;
      this.openDialog(event);
    }
    else {
      const fi = this.fileInput.nativeElement;
      if (fi.files && fi.files[0]) {
        this.ehVideo = fi.files[0].type.indexOf("video") > -1;

        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.url = <string>reader.result;
          this.propagateChange(this.url);
        };
        reader.readAsDataURL(fi.files[0]);
      }
    }
  }

  propagateChange = (_: any) => { };

  writeValue(value: any): void {
    this.url = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  isValid(): boolean {
    return this.url != null && this.url !== '';
  }

  isRequired(): boolean {
    if (!this.control.errors) {
      return false;
    }
    return this.control.errors.required;
  }

  openDialog(event: any) {
    const dialogRef = this._dialog.open(UploadCropperComponent, {
      width: '50%',
      data: { event: event, aspectRatio: this.aspectRatio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.url = result;
        this.propagateChange(this.url);
      }
      else
        this.removeFile();
    });
  }
}
