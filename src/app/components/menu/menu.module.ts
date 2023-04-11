import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
    MatToolbarModule,
    MatSidenavModule,
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSelectModule
} from 'src/app/app.material';

import { NavbarHeaderComponent } from './navbar-header/navbar-header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@NgModule({
    declarations: [
        NavbarHeaderComponent,
        SidenavComponent,
        UserMenuComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        MatToolbarModule,
        MatSidenavModule,
        MatExpansionModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSelectModule
    ],
    exports: [
        NavbarHeaderComponent,
        SidenavComponent,
        UserMenuComponent
    ]
})
export class MenuModule { }