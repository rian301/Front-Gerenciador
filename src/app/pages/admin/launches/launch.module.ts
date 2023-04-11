import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { LaunchService } from 'src/app/services/admin/launcher.service';
import { SharedAdminModule } from 'src/app/shared/shared-admin.module';
import { LaunchListComponent } from './launch-list/launch-list.component';
import { LaunchComponent } from './launch/launch.component';
import { LaunchRoutingModule } from './launch.routing';



@NgModule({
  imports: [
    SharedAdminModule,
    LaunchRoutingModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [
    LaunchListComponent,
    LaunchComponent
  ],
  providers: [
    LaunchService
  ]
})
export class LaunchModule { }
