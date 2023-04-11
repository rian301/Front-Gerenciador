import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { ClassService } from 'src/app/services/admin/class.service';
import { SharedAdminModule } from 'src/app/shared/shared-admin.module';
import { ClassListComponent } from './class-list/class-list.component';
import { ClassRoutingModule } from './class.routing';
import { ClassComponent } from './class/class.component';

@NgModule({
  imports: [
    SharedAdminModule,
    ClassRoutingModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [
    ClassComponent,
    ClassListComponent
  ],
  providers: [
    ClassService
  ]
})
export class ClassModule { }
