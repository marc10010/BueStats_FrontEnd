import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { dialogData } from 'src/app/types/api';


@Component({
    selector: 'dialog-content-error',
    templateUrl: 'dialog-content-error.html',
  })

export class DialogContentErrors {

  constructor(
    public dialogRef: MatDialogRef<DialogContentErrors>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
  ) {}
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
 
