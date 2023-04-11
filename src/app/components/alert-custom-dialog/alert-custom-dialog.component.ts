import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './alert-custom-dialog.component.html',
  styleUrls: ['./alert-custom-dialog.component.scss']
})

export class AlertCustomDialogComponent implements OnInit {

  constructor (
    public dialogRef: MatDialogRef<AlertCustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[] 
  ) { 

  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

}
