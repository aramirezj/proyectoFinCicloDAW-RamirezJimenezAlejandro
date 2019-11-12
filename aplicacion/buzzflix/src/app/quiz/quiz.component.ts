import { Component, OnInit, Input } from '@angular/core';
import { Usuario } from '../modelo/Usuario';
import { QuizService } from '../services/quiz.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { AuthService } from '../services/auth.service';
import { FileService } from '../services/file.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  id: number
  idaux: number
  clase: string = "fa fa-star"
  estrellas: number = 0;
  @Input() quizz
  usuario: Usuario
  isCreador: boolean
  downloadURL: any
  urlClick: string | number;
  urlShare: string;
  urlName: string;
  constructor(
    private QuizService: QuizService,
    private authService: AuthService,
    private fileService: FileService,
    private snackBar:MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.id = this.quizz.id;
    this.isCreador = this.quizz.creador == this.authService.getAuthUserId() ? true : false;
    this.usuario = new Usuario(this.quizz.creador, null, this.quizz.nickname, null);
    this.estrellas = this.quizz.estrellas / this.quizz.votantes;
    this.estrellas = isNaN(this.estrellas) ? 0 : Math.round(this.estrellas);
    this.quizz.image = this.quizz.image == null ? JSON.parse(this.quizz.contenido).image : this.quizz.image;

    this.quizz.image = this.quizz.image == null ? "hehexd.jpg" : this.fileService.obtenerUrl(this.quizz.image);

    this.urlClick = this.quizz.privado != null ? this.quizz.privado : this.id;
    this.urlName = this.quizz.privado != null ? this.QuizService.buildUrl(this.quizz.titulo, this.quizz.privado) : this.QuizService.buildUrl(this.quizz.titulo, this.quizz.id);

    if (this.quizz.privado != null) {
      this.quizz.titulo = this.quizz.titulo + " (Quiz privado)";
    } else if (this.quizz.publicado == 0) {
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
      this.QuizService.borraQuizz(this.quizz).subscribe();
      this.quizz = null;
    }
  }
  cambiar() {
    let privado: boolean = false;
    if (this.quizz.privado == null) {
      privado = true;
    }
    this.quizz.id = this.id;
    this.QuizService.cambiaTipo(this.quizz, privado)
      .subscribe();
  }


}



