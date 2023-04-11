import { PdfComponent } from "./pdf.component";
import { NgModule } from "@angular/core";
import { PdfService } from "./pdf.service";

@NgModule({
    imports: [
        PdfComponent,
        PdfService
    ],
    exports: [
        PdfComponent,
        PdfService
    ],
    providers:
        [
            PdfService,
        ],
})

export class PdfModule { }
