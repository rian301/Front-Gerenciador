import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DoughnutChartModel } from './doughnut-chart.model';

@Component({
  selector: 'doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})

export class DoughnutChartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  options: Highcharts.Options;
  subs: DoughnutChartModel[] = [];
  passoAtras: DoughnutChartModel[] = [];
  passoAtual: string;
  chartRef: any;

  constructor() { }

  voltarItem(sub: DoughnutChartModel) {
    this.passoAtual = null;
    this.entrarSub(sub);

    let novosPassos = []
    for (let index = 0; index < this.passoAtras.indexOf(sub); index++)
      novosPassos.push(this.passoAtras[index]);

    this.passoAtras = novosPassos;
  }

  adicionarPassoAtras(sub: DoughnutChartModel) {
    if (this.passoAtras.find(x => x.codigo == sub.codigo) == null && sub.subs?.length > 0)
      this.passoAtras.push(sub);
  }

  entrarSub(subPai: DoughnutChartModel) {
    let datas = [];
    if (subPai.subs.length > 0) {
      subPai.subs.forEach(sub => {
        datas.push({ name: sub.nome, y: sub.valor, value: sub.codigo, subs: sub.subs });
      });
    }

    this.chartRef.series.map(x => x.update(null));
    this.chartRef.series.map(x => x.setData(datas));
    this.subs = subPai.subs;

    if (subPai.codigo)
      this.passoAtual = subPai.nome;
  }

  @Input()
  public set datasChart(data: DoughnutChartModel) {
    var page = this;

    this.options = Highcharts.defaultOptions;
    if (data != null) {
      let datas = [];
      let cores = [];
      cores = data.cores;

      if (data.subs?.length > 0) {
        this.subs = data.subs;
        data.subs.forEach(sub => {
          datas.push({ name: sub.nome, y: sub.valor, value: sub.codigo, subs: sub.subs });
        });
      }
      else
        datas.push({ name: 'Vazio', y: 0.01, value: 0.01, subs: [] });

      this.options = {
        chart: {
          type: 'pie',
        },
        title: {
          text: data.nome
        },
        exporting: {
          enabled: true,
        },
        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: `${data.visualizacao == "Valor" ? '<span style="color:{point.color}">{point.name}</span>: <b>R$:{point.y:.2f}<br/>' : '<span style="color:{point.color}">{point.name}</span>: <b>{point.percentage:.1f} %<br/>'}`
        },
        credits: {
          enabled: true,
          text: 'D3Set',
          mapText: 'D3Set',
          mapTextFull: 'D3Set',
          href: ''
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            innerSize: "40%",
            dataLabels: {
              enabled: true
            },
            showInLegend: true,
          },
          series: {
            animation: false,
            dataLabels: {},
            events: {
              click: function (event: any) {
                try {
                  page.chartRef = this.chart;
                  let subEscolhida = page.subs.find(x => x.codigo == event.point.value);

                  if (subEscolhida.subs?.length > 0)
                    if (subEscolhida.codigoPai == null) {
                      page.adicionarPassoAtras(new DoughnutChartModel([], "Geral", 0, 0, null, page.subs));
                      page.entrarSub(subEscolhida);
                    } else {
                      page.adicionarPassoAtras(page.passoAtras[page.passoAtras.length - 1].subs.find(x => x.codigo == subEscolhida.codigoPai));
                      page.entrarSub(subEscolhida);
                    }
                } catch (error) { }
              }
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          itemMarginBottom: 10,
          floating: true,
        },
        series: [{
          type: 'pie',
          name: 'Quantidade',
          data: datas,
        }],
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
        colors: cores
      };
    }
  }


}
