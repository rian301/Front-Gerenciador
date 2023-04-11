import { NgModule } from "@angular/core";
import { MatIconModule, MatButtonModule, MatDialogModule } from "src/app/app.material";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { BreadcrumbComponent } from "./breadcrumb.component";

@NgModule({
    declarations: [
        BreadcrumbComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule
    ],
    exports: [
        BreadcrumbComponent
    ],
})

export class BreadcrumbModule { }
