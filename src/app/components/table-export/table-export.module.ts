import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableExportComponent } from './table-export.component';
import { MatButtonModule, MatIconModule, MatTooltipModule } from 'src/app/app.material';

@NgModule({
    declarations: [
      TableExportComponent        
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,          
    ],
    exports: [
        TableExportComponent
    ],
    providers: []
})
export class TableExportModule {  }
