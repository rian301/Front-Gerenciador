import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from 'src/app/app.material';

@Component({
  selector: 'app-remocao-dialog',
  templateUrl: './remocao-dialog.component.html',
  styleUrls: ['./remocao-dialog.component.scss']
})
export class RemocaoDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<RemocaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
