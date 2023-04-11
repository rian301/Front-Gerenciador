import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DinamicTableModule } from 'src/app/components/dinamic-table/dinamic-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatStepperModule,
  MatCardModule,
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatTabsModule,
  MatSelectModule,
  MatCheckboxModule, MatAutocompleteModule, MatSortModule, MatDatepickerModule, MatTooltipModule
} from 'src/app/app.material';

import { UploadModule } from 'src/app/components/upload/upload.module';
import { NgxMaskModule } from 'ngx-mask'
import { AppService } from 'src/app/services/admin/app.service';
import { InputValidatorModule } from 'src/app/components/input-validator/input-validator.module';
import { UtilService } from 'src/app/services/admin/util.service';
import { UtilitariosService } from 'src/app/services';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CancelarDialogModule } from 'src/app/components/cancelar-dialog/cancelar-dialog.module';
import { HttpRequestInterceptor } from '../interceptors/http.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { StatusBadgeModule } from '../components/status-badge/status-badge.module';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ProgressSpinnerModule } from '../components/progress-spinner/progress-spinner.module';
import { ModalConfirmationModule } from '../components/modal-confirmation/modal-confirmation.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableExportModule } from '../components/table-export/table-export.module';
import { ExcelService } from '../services/common/export-excel/excel.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    DinamicTableModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    UploadModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxMaskModule.forRoot(),
    InputValidatorModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSortModule,    
    CancelarDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    StatusBadgeModule,
    MaterialFileInputModule,
    ProgressSpinnerModule,
    MatPaginatorModule,
    NgSelectModule,
    TableExportModule,
    CKEditorModule,
    // ModalConfirmationModule
  ],
  exports: [
    CommonModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    DinamicTableModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    UploadModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,    
    InputValidatorModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSortModule,    
    CancelarDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    StatusBadgeModule,
    MaterialFileInputModule,
    ProgressSpinnerModule,
    MatPaginatorModule,
    NgSelectModule,
    TableExportModule,
    CKEditorModule,
    // ModalConfirmationModule
  ],
  providers:
    [
      AppService,
      UtilService,
      UtilitariosService, 
      ExcelService,
      { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
    ],
})
export class SharedAdminModule { }
