import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { LineChartComponent } from './line-chart/line-chart.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
    declarations: [
        LineChartComponent,
        DoughnutChartComponent,
        BarChartComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        ChartsModule,
        HighchartsChartModule
    ],
    exports: [
        LineChartComponent,
        DoughnutChartComponent,
        BarChartComponent
    ],
    providers: []
})
export class ChartModule { }