import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.scss']
})
export class DialogboxComponent implements OnInit {

    description:string;

    constructor(
        private dialogRef: MatDialogRef<DialogboxComponent>,
        @Inject(MAT_DIALOG_DATA) data) {
        this.description = data.title;
    }

    ngOnInit() {

    }

    save() {
        this.dialogRef.close(true);
    }

    close() {
        this.dialogRef.close(false);
    }

}
