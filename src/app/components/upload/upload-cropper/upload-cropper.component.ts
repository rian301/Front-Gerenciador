import { OnInit, Inject, Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from 'src/app/app.material';
import { ImageCroppedEvent } from 'ngx-image-cropper';

export interface DialogData {
  event: any;
  aspectRatio: any;
}

@Component({
  selector: 'app-upload-cropper',
  templateUrl: './upload-cropper.component.html',
  styleUrls: ['./upload-cropper.component.scss']
})

export class UploadCropperComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    public dialogRef: MatDialogRef<UploadCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.imageChangedEvent = this.data.event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  salvar(): void {
    this.dialogRef.close(this.croppedImage);
  }
}
