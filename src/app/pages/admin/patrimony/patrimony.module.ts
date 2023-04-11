import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { MentoredService } from 'src/app/services/admin/mentored.service';
import { SharedAdminModule } from 'src/app/shared/shared-admin.module';
import { PatrimonyRoutingModule } from './patrimony.routing';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { CategoryBensListComponent } from './category-bens-list/category-bens-list.component';
import { CategoryBensComponent } from './category-bens/category-bens.component';
import { ExpenseCategoryService } from 'src/app/services/admin/expense-category.service';
import { AssetsCategoryService } from 'src/app/services/admin/assets-category.service';
import { PatrimonyListComponent } from './patrimony-list/patrimony-list.component';
import { PatrimonyComponent } from './patrimony/patrimony.component';
import { ProviderService } from 'src/app/services/admin/provider.service';
import { PatrimonyService } from 'src/app/services/admin/patrimony.service';
import { ModalDocComponent } from './modal-doc/modal-doc.component';

@NgModule({
  imports: [
    SharedAdminModule,
    PatrimonyRoutingModule,
    NgxMaskModule.forRoot(),
    CurrencyMaskModule,
    DragDropModule,
  ],
  declarations: [
    CategoryBensListComponent,
    CategoryBensComponent,
    PatrimonyListComponent,
    PatrimonyComponent,
    ModalDocComponent,
  ],
  providers: [
    AssetsCategoryService,
    ProviderService,
    PatrimonyService
  ]
})
export class  PatrimonyModule { }
