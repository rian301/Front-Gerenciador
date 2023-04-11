// RatingComponent by Swordmaster
// Developer: Lucas Buetto De Angelis

import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

    @Input()
    total: number = 5;

    @Input()
    current: number = 0;

    @Input()
    iconClassRate: string = "fas fa-star";

    @Input()
    iconClassNotRate: string = "far fa-star";

    rates: any[] = [];

    constructor() { }

    ngOnInit() {
        this.drawRating();
    }

    drawRating() {
        for (let i = 0; i < this.total; i++) {
            if( i < this.current) {
                this.rates.push(true);
            }
            else {
                this.rates.push(false);
            }
        }
    }

}
