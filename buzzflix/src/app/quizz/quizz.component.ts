import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Usuario } from '../modelo/Usuario';
import { QuizzService } from '../services/quizz.service';
import { Quizz } from '../modelo/Quizz';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent implements OnInit {
  id: number
  clase: string = "fa fa-star"
  estrellas: number
  @Input() quizz
  usuario: Usuario
  constructor(
    private userService: UserService,
    private quizzService: QuizzService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userService.getUserById(this.quizz.creador)
      .then((resp) => {
        this.usuario = resp;
        console.log(this.quizz)
        this.quizzService.getMedia(this.quizz.id)

          .then((resp) => {
            this.estrellas = this.quizz.estrellas / resp;
          })

      })
    this.quizz.image = JSON.parse(this.quizz.contenido).image;
    if (this.quizz.image == null) {
      this.quizz.image = "koala.jpg";
    }


  }

  generaEstrella(n: number) {
    if (this.estrellas >= n) {
      return "fa fa-star checked";
    } else {
      return "fa fa-star";
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });

}

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
