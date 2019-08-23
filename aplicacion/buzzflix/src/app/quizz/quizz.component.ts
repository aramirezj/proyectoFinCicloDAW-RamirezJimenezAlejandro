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
import { NotifyService } from '../services/notify.service';
@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent implements OnInit {
  id: number
  idaux: number
  clase: string = "fa fa-star"
  estrellas: number=0;
  @Input() quizz
  usuario: Usuario
  isCreador: boolean
  downloadURL: any
  privado: boolean
  constructor(
    private userService: UserService,
    private quizzService: QuizzService,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    private notifyService: NotifyService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    
    this.id = this.quizz.id;
    this.privado = false;
    this.userService.getUserById(this.quizz.creador)
      .subscribe((resp) => {
        this.usuario = resp;
        this.isCreador = this.usuario.id == this.authService.getAuthUserId();
        this.quizzService.getMedia(this.quizz.id)
          .subscribe((resp) => {
            this.estrellas = this.quizz.estrellas / resp;
            if(isNaN(this.estrellas)){
              this.estrellas=0;
            }else{
              this.estrellas = Math.round(this.estrellas);
            }
          })
      })
    this.quizz.image = JSON.parse(this.quizz.contenido).image;
    if (this.quizz.image == null) {
      this.quizz.image = "hehexd.jpg";
    } else {
      this.quizz.image = this.afStorage.ref(this.quizz.image).getDownloadURL();
    }
    if (this.quizz.privado != null) {
      this.quizz.titulo = this.quizz.titulo + " (Quiz privado)";
      this.quizz.id = this.quizz.privado;
      this.privado = true;
    }else if(this.quizz.publicado==0){
      this.quizz.titulo = this.quizz.titulo + " (Pendiente de moderación)";
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

  borrar(accion) {
    if (accion) {
      this.quizzService.borraQuizz(this.quizz);
      this.quizz=null;
    }
  }
  cambiar() {
    let privado: boolean = false;
    if (this.quizz.privado == null) {
      privado = true;
    }
    this.quizz.id = this.id;
    this.quizzService.cambiaTipo(this.quizz, privado)
    .subscribe((resp)=>{});
  }
  obtenerURL() {
    var url = "localhost:4200/ver/quizz/" + this.quizz.id;
    var textArea = document.createElement("textarea");
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    $(textArea).remove();
    this.notifyService.notify("¡Enlace copiado!","success");
    
  }

}



