import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Usuario } from '../modelo/Usuario';
import { QuizzService } from '../services/quizz.service';
import { Quizz } from '../modelo/Quizz';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { AuthService } from '../services/auth.service';
import { AngularFireStorage } from 'angularfire2/storage';
import * as $ from 'jquery';
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
  isCreador: boolean
  downloadURL:any
  constructor(
    private userService: UserService,
    private quizzService: QuizzService,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userService.getUserById(this.quizz.creador)
      .then((resp) => {
        this.usuario = resp;
        this.isCreador = this.usuario.id == this.authService.getAuthUserId();
        this.quizzService.getMedia(this.quizz.id)

          .then((resp) => {
            this.estrellas = this.quizz.estrellas / resp;
          })
      })
    this.quizz.image = JSON.parse(this.quizz.contenido).image;
    if (this.quizz.image == null) {
      this.quizz.image = "hehexd.jpg";
    }else{
      this.quizz.image = this.afStorage.ref(this.quizz.image).getDownloadURL();
    }
    
  }

  generaEstrella(n: number) {
    if (this.estrellas >= n) {
      return "fa fa-star checked";
    } else {
      return "fa fa-star";
    }
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {

    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: 1,
      title: '¿Estas seguro de querer borrarlo? De la incineradora no lo saca nadie.'
    };

    const dialogRef = this.dialog.open(DialogboxComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => this.borrar(data)
      
    );
  }

  borrar(accion){
    if(accion){
      this.quizzService.borraQuizz(this.quizz);
    }
  }

}



