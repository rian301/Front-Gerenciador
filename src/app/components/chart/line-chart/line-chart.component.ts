import { Component, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { LineChartModel } from './line-chart.model';

@Component({
	selector: 'line-chart',
	templateUrl: './line-chart.component.html',
	styleUrls: ['./line-chart.component.scss']
})

export class LineChartComponent {
	Highcharts: typeof Highcharts = Highcharts;
	options: Highcharts.Options;

	@Input()
	public set datasChart(datasChart: LineChartModel[]) {
		this.options = Highcharts.defaultOptions;

		if (datasChart != null && datasChart.length > 0) {
			let series: any = [];
			let cores = [];

			datasChart.forEach((data: LineChartModel) => {
				series.push({
					name: data.titulo,
					data: data.valores,
				});
				cores.push(data.cor);
			});

			this.options = {
				chart: {
					type: 'spline',
				},
				title: {
					text: ""
				},
				legend: {
					enabled: false
				},
				xAxis: {
					categories: datasChart.map(x => x.legendas).toString().split(','),
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
			Highcharts.chart('line', this.options);
		}
	}
}
