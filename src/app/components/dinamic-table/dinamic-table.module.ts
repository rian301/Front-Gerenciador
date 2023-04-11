import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms';

import {
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonModule, MatSlideToggleModule, MatIconModule, MatTooltipModule, MatPaginatorIntl
} from 'src/app/app.material';

import { DinamicTableComponent } from './dinamic-table.component';
import { BollToStatusPipe, BollToTextPipe } from '../../pipes';
import { PdfService } from '../pdf/pdf.service';
import { CdkTableModule } from '@angular/cdk/table';

const rangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `0 de ${length}`; }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
}

export function getIntl() {
    const paginatorIntl = new MatPaginatorIntl();
    paginatorIntl.itemsPerPageLabel = 'Quantidade por página:';
    paginatorIntl.nextPageLabel = 'Próxima página';
    paginatorIntl.previousPageLabel = 'Página anterior';
    paginatorIntl.firstPageLabel = 'Primeira página';
    paginatorIntl.lastPageLabel = 'Última página';
    paginatorIntl.getRangeLabel = rangeLabel;
    return paginatorIntl;
}

@NgModule({
    declarations: [
        DinamicTableComponent,
        BollToTextPipe,
        BollToStatusPipe
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatIconModule,
        MatTooltipModule,
        CdkTableModule,
    ],
    exports: [
        DinamicTableComponent
    ],
    providers: [
        PdfService,
        { provide: MatPaginatorIntl, useValue: getIntl() }
    ]
})


export class DinamicTableModule { }
