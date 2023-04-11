import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { CustomerListModel, CustomerModel } from 'src/app/models';
import * as XLSX from 'xlsx';

@Injectable()
export class ImportExcelService {
    constructor() { }
    // listCustomer: CustomerModel[] = [];
    // upload(arrayBuffer: any, file: File) {
    //     return new Observable(observer => {
    //         let fileReader = new FileReader();
    //         fileReader.onload = ((e) => {
    //             arrayBuffer = fileReader.result
    //             var data = new Uint8Array(arrayBuffer);
    //             var arr = new Array();
    //             for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    //             var bstr = arr.join("");
    //             var workbook = XLSX.read(bstr, { type: "binary" });
    //             var first_sheet_name = workbook.SheetNames[0];
    //             var worksheet = workbook.Sheets[first_sheet_name];
    //             var list: CustomerModel[] = [];
    //             XLSX.utils.sheet_to_json(worksheet, { raw: true }).map((t: any) => {
    //                 var customerModel = new CustomerModel();
    //                 customerModel.name = t.Nome;
    //                 customerModel.email = t.Email;
    //                 customerModel.cpf = t.Documento;
    //                 customerModel.phoneNumber = t.DDD + t.Telefone;
    //                 customerModel.zipCode = t.CEP;
    //                 customerModel.street = t.Endereço;
    //                 customerModel.number = t.Número;
    //                 customerModel.complement = t.Complemento;
    //                 customerModel.district = t.Bairro;
    //                 customerModel.city = t.Cidade;
    //                 customerModel.state = t.Estado;
    //                 list.push(customerModel);
    //             });
    //             this.listCustomer = list;
    //             console.log("Lista ", this.listCustomer);
    //         })
    //         fileReader.readAsArrayBuffer(file);
    //         observer.next(this.listCustomer);
    //         observer.complete();
    //     })
    // }
}

