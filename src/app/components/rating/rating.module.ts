// RatingComponent by Swordmaster
// Developer: Lucas Buetto De Angelis

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './rating.component';

@NgModule({
    declarations: [
        RatingComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        RatingComponent
    ]
})
export class RatingModule { }
