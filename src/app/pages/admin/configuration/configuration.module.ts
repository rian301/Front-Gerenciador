import { NgModule } from "@angular/core";
import { ProfileService } from "src/app/services/admin/profile.service";
import { SharedAdminModule } from "src/app/shared/shared-admin.module";
import { ConfigurationRoutingModule } from "./configuration.routing";
import { ProfileListComponent } from "./profile-list/profile-list.component";
import { ProfileComponent } from "./profile/profile.component";
import { UserChangePasswordComponent } from "./user-change-password/user-change-password.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserComponent } from "./user/user.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    imports: [
        SharedAdminModule,
        ConfigurationRoutingModule,
        HttpClientModule
    ],
    declarations: [
        ProfileListComponent,
        ProfileComponent,
        UserComponent,
        UserChangePasswordComponent,
        UserListComponent
    ],
    providers: [
        ProfileService
    ]
})
export class ConfigurationModule { }