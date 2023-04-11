import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { BarChartModel } from './bar-chart.model';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  options: Highcharts.Options;

  @Input()
  public set datasChart(datasChart: BarChartModel[]) {
    this.options = Highcharts.defaultOptions;

    if (datasChart != null && datasChart.length > 0) {
      let series: any = [];
      let cores = [];

      datasChart.forEach((data: BarChartModel) => {
        series.push({
          name: data.titulo,
          data: [data.valor],
        });
        cores.push(data.cor);
      });

      this.options = {
        chart: {
          type: 'column',
          height: 300,
          inverted: datasChart[0].horizontal,
          polar: false
        },
        title: {
          text: ""
        },
        xAxis: {
          categories: [''],
          crosshair: true
        },
        credits: {
          enabled: true,
          text: 'D3Set',
          mapText: 'D3Set',
          mapTextFull: 'D3Set',
          href: ''
        },
        series: series,
        lang: {
          viewFullscreen: "Ver em tela cheia",
          resetZoom: "Limpar Zoom",
          downloadPNG: "Download PNG",
          downloadJPEG: "Download JPEG",
          downloadPDF: "Download PDF",
          downloadSVG: "Download SVG",
          printChart: "Imprimir",
          contextButtonTitle: ""
        },
        exporting: {
          enabled: true,
        },
        colors: cores,
        yAxis: {
          title: {
            text: ""
          }
        }
      };
    }
  }
}
