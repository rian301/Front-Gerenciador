import { NgModule } from '@angular/core';
import { SharedAdminModule } from 'src/app/shared/shared-admin.module';
import { ModalConfirmationComponent } from './modal-confirmation.component';

@NgModule({
  declarations: [
    ModalConfirmationComponent
  ],
  imports: [
    SharedAdminModule
  ],
  exports: [
    ModalConfirmationComponent,
  ]
})
export class ModalConfirmationModule { }
