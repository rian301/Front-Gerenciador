import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-pages.routing';
import { AdminModule } from '../../layouts/admin/admin.module'
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
  MatCheckboxModule, MatAutocompleteModule, MatSortModule
} from 'src/app/app.material';

import { UploadModule } from 'src/app/components/upload/upload.module';
import { NgxMaskModule } from 'ngx-mask'
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AppService } from 'src/app/services/admin/app.service';
import { UserService } from 'src/app/services/admin/user.service';
import { InputValidatorModule } from 'src/app/components/input-validator/input-validator.module';
import { UtilService } from 'src/app/services/admin/util.service';
import { PermissionService, UtilitariosService } from 'src/app/services';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from 'src/app/interceptors/http.interceptor';
import { QRCodeModule } from 'angular2-qrcode';
import { CancelarDialogModule } from 'src/app/components/cancelar-dialog/cancelar-dialog.module';
import { DashBordService } from 'src/app/services/admin/dashboard.service';
import { ImportExcelService } from 'src/app/services/common/import-excel/import-exel.service';

@NgModule({
  imports: [
    CommonModule,
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    AdminRoutingModule,
    DinamicTableModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AdminModule,
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
    QRCodeModule,
    CancelarDialogModule,
  ],
  declarations: [
    ChangePasswordComponent,
    DashboardComponent,
    ],
  providers:
    [
      UserService,
      AppService,
      UtilService,
      UtilitariosService,
      DashBordService,
      ImportExcelService,
      PermissionService,
      { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
    ],
})
export class AdminPagesModule { }
