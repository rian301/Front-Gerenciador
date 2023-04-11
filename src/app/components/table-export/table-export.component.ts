import { Component, Input } from '@angular/core';
import { MatTableDataSource } from 'src/app/app.material';
import { ExcelService } from 'src/app/services/common/export-excel/excel.service';

@Component({
	selector: 'app-table-export',
	templateUrl: './table-export.component.html',
	styleUrls: ['./table-export.component.scss']
})
export class TableExportComponent {

	@Input()
	dataSource = new MatTableDataSource();

	@Input()
	columns: any[];

	@Input()
	columnsName: any[];

	@Input()
	name: string;

	constructor(
		private excelService: ExcelService
	) { }

	exportItems() {
		let dataExport: any[] = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
		let data: any[] = this.filtrarExportTable(dataExport, this.columns, this.columnsName);
		this.excelService.exportAsExcelFile(data, this.removerAcentos(this.name));
	}

	filtrarExportTable(dataSource: any[], columns: any[],  columnsName: any[]): any[] {
		if (!columns.length)
			return;

		if (dataSource == null)
			return;

		const dataExport = dataSource.map(function (d) {
			let obj = {};
			for (let i = 0; i < columns.length; i++) {
				let column = columns[i];
				let columnName = columnsName == null ?  column : columnsName[i];
				let columnSplit = column.toString().split(".");

				if (d[columnSplit[0]] != null && typeof (d[columnSplit[0]]) == "object" && d[columnSplit[0]][columnSplit[1]] != null)
					obj[columnName] = d[columnSplit[0]][columnSplit[1]].toString();
				else
					obj[columnName] = d[column] == null ? '' : d[column].toString();
			}
			return obj;
		});

		return dataExport;
	}

	removerAcentos(text: string) {
		return text ? text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/( )+/g, "").toLowerCase() : "";
	}
}
