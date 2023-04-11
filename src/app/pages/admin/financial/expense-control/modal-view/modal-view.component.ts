import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from 'src/app/app.material';

@Component({
  selector: 'app-modal-view',
  templateUrl: './modal-view.component.html',
  styleUrls: ['./modal-view.component.scss']
})
export class ModalViewComponent implements OnInit {
  title: string = "Visualização de documento";
  isPdf: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private _dialogRef: MatDialogRef<ModalViewComponent>,
  ) { }

  ngOnInit(): void {
    if(this.data.includes(".pdf"))
    this.isPdf = true;
    console.log(this.data);
  }

}
