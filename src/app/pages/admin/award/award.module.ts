import { NgModule } from '@angular/core';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxMaskModule } from 'ngx-mask';
import { CustomerService } from 'src/app/services';
import { AwardService } from 'src/app/services/admin/award.service';
import { GiftService } from 'src/app/services/admin/gift.service';
import { MentoredService } from 'src/app/services/admin/mentored.service';
import { SentService } from 'src/app/services/admin/sent.service';
import { SharedAdminModule } from 'src/app/shared/shared-admin.module';
import { AwardListComponent } from './award-list/award-list.component';
import { AwardRoutingModule } from './award.routing';
import { AwardComponent } from './award/award.component';
import { GiftDocComponent } from './gift-doc/gift-doc.component';
import { GiftListComponent } from './gift-list/gift-list.component';
import { GiftComponent } from './gift/gift.component';
import { SentListComponent } from './sent-list/sent-list.component';
import { SentComponent } from './sent/sent.component';

@NgModule({
  imports: [
    SharedAdminModule,
    AwardRoutingModule,
    NgxMaskModule.forRoot(),
    CurrencyMaskModule,
  ],
  declarations: [
    AwardComponent,
    AwardListComponent,
    SentComponent,
    SentListComponent,
    GiftListComponent,
    GiftComponent,
    GiftDocComponent
  ],
  providers: [
    AwardService,
    SentService,
    CustomerService,
    GiftService,
    MentoredService
  ]
})
export class AwardModule { }
