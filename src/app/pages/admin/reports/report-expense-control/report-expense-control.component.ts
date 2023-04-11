import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ExpenseReportTypeEnum,
  listaExpenseReportTypeEnum,
} from "src/app/enums/report-expense-type.enum";
import { ExpenseCategoryModel } from "src/app/models/expense-category.model";
import { ReportExpenseControlModel } from "src/app/models/report-expense-control.model";
import { UtilitariosService } from "src/app/services";
import { ExpenseCategoryService } from "src/app/services/admin/expense-category.service";
import { ReportService } from "src/app/services/admin/reports.service";

@Component({
  selector: "app-report-expense-control",
  templateUrl: "./report-expense-control.component.html",
  styleUrls: ["./report-expense-control.component.scss"],
})
export class ReportExpenseControlComponent implements OnInit {
  title: string = "Relatório de Gastos Externos";
  form: FormGroup;
  startDateInit = new Date();
  startDateEnd = new Date();
  loading: boolean = false;
  types = listaExpenseReportTypeEnum();
  categories: ExpenseCategoryModel[] = [];
  categoriesSelected: [] = [];
  filterCategory: number;
  isRequired: boolean = false;

  constructor(
    private _formbuilder: FormBuilder,
    private _reportService: ReportService,
    private _utilitariosService: UtilitariosService,
    private _expenseService: ExpenseCategoryService,
    private _datePipe: DatePipe
  ) {
    this.startDateInit.setDate(this.startDateInit.getDate() - 30);
    this.form = this._formbuilder.group({
      id: [null],
      datInit: [this.startDateInit, Validators.required],
      datEnd: [this.startDateEnd, Validators.required],
      typeReport: [ExpenseReportTypeEnum.All, Validators.required],
      categories: [null]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.form.get('categories').disable();
  }

  typeSelect(value) {
    if (value == 1) {
      this.form.controls.typeReport.setValue(ExpenseReportTypeEnum.All);
      this.form.get('categories').disable();
      this.form.controls.categories.setValue(null);
    }
    else if (value == 2) {
      this.form.controls.typeReport.setValue(ExpenseReportTypeEnum.Category);
      this.form.get('categories').disable();
      this.form.controls.categories.setValue(null);
    }
    else {
      this.form.controls.typeReport.setValue(ExpenseReportTypeEnum.Customized);
      this.form.get('categories').enable();
      this.isRequired = true;
    }

  }

  loadCategories() {
    this.loading = true;
    this._expenseService.get()
      .toPromise()
      .then((ret) => {
        console.log(ret);

        this.categories = ret;
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this._utilitariosService.HttpErrorReturn(error, (msg, ret) => {
          this._utilitariosService.SnackAlert(msg, 'error');
        });
      });
  }

  reportExpense() {
    this.loading = true;
    let model = <ReportExpenseControlModel>this.form.value;
    this._reportService
      .GetAllExpenseControlByPeriod(model)
      .toPromise()
      .then((resp) => {
        if (resp)
          this.downloadFile(resp);
          this.loading = false;
      })
      .catch((errors) => {
        this._utilitariosService.HttpErrorReturn(errors, (msg, ret) => {
        });
      });
  }

  downloadFile(data: any) {
    const blob = data.body;
    const url = window.URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.href = url;
    link.download = `Relatório Gastos Exeternos-${this._datePipe.transform(
      new Date().toString(),
      "dd/MM/yyyy"
    )}`;
    link.click();
  }
}
