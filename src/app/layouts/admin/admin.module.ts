import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
	MatToolbarModule,
	MatSidenavModule,
	MatMenuModule,
	MatCardModule,
} from 'src/app/app.material';

import { AdminComponent } from './admin.component';

import { NavbarModule } from '../../components/navbar/navbar.module';
import { MenuModule } from 'src/app/components/menu/menu.module';
import { AdminService } from 'src/app/services';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		NavbarModule,
		MatToolbarModule,
		MatSidenavModule,
		MatMenuModule,
		MenuModule,
		MatCardModule,
	],
	declarations: [
		AdminComponent
	],
	providers: [
		AdminService,
	]
})
export class AdminModule { }
