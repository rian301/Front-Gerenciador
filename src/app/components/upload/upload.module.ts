import { NgModule } from '@angular/core';
import { UploadComponent } from './upload.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatIconModule, MatMenuModule, MatButtonModule } from 'src/app/app.material';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UploadCropperComponent } from './upload-cropper/upload-cropper.component';

@NgModule({
  declarations: [
    UploadComponent,
    UploadCropperComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    ImageCropperModule,
    MatButtonModule,
  ],
  exports: [
    UploadComponent
  ],
  entryComponents: [UploadCropperComponent],
  providers: [
  ]
})

export class UploadModule { }
