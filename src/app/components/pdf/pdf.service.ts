import { Injectable } from "@angular/core";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FontTitleType, FontContentType, ContentTable, PdfComponent, ContentImage } from "./pdf.component";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Injectable()
export class PdfService {

    generateImagePdf(image: string) {
        var maker: PdfComponent = new PdfComponent();
        maker.insertImage("", FontTitleType.Subtitle, FontContentType.Normal, new ContentImage(image, 300));

        pdfMake.createPdf(maker.getDocument()).open();
    }

    generateTablePdf(titles: string[], values: any, tableTitle: string = "Lista") {
        var maker: PdfComponent = new PdfComponent();
        maker.insertTable(tableTitle, FontTitleType.Subtitle, FontContentType.Normal, new ContentTable(titles, values
        ));

        maker.insertTitle(maker.defaultImage, `Procard Admin - ${tableTitle}`);

        pdfMake.createPdf(maker.getDocument()).open();
    }

    generatePdf(canvas) {
        var html = htmlToPdfmake(canvas);

        var docDefinition = {
            compress: true,
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [20, 60, 20, 60],
            info: {
                title: `Procard Agente - ${Date.now()}`,
                author: 'Procard Agente',
                subject: 'Procard Agente',
                keywords: 'Procard Agente',
            },
            header: {
                table: {
                    headerRows: 2,
                    widths: [35, '*'],
                    body: [[{
                        image: new PdfComponent().defaultImage,
                        width: 35,
                        margin: [10, 5, 20, 5],
                    }, { text: 'Teste de Impressão', style: 'headerLine', margin: [0, 15, 0, 0], }], [{}, {}]],
                },
                layout: 'lightHorizontalLines',
            },
            footer: function (currentPage, pageCount) {
                return {
                    columns: [
                        '',
                        currentPage.toString() + ' / ' + pageCount,
                        {
                            image: new PdfComponent().defaultImage,
                            width: 25,
                            margin: [0, 0, 0, 0],
                        },
                    ],
                    margin: [20, 25, 20, 0],
                }
            },
            content: html,
            styles: {
                title: {
                    fontSize: 12,
                    bold: true
                },
                normal: {
                    fontSize: 10,
                },
            }
        };

        pdfMake.createPdf(docDefinition).open();
    }
}
