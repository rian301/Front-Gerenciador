import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { ProductService } from 'src/app/services/admin/product.service';
import { SharedAdminModule } from 'src/app/shared/shared-admin.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductRoutingModule } from './product.routing';
import { ProductComponent } from './product/product.component';

@NgModule({
  imports: [
    SharedAdminModule,
    ProductRoutingModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [
    ProductListComponent,
    ProductComponent
  ],
  providers: [
    ProductService
  ]
})
export class ProductModule { }
