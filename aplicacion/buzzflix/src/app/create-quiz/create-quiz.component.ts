import { Component, OnInit, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { QuizService } from '../services/quiz.service';
import { Solucion } from '../modelo/Solucion';
import { NgProgress } from 'ngx-progressbar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Pregunta } from '../modelo/Pregunta';
import { Respuesta } from '../modelo/Respuesta';
import { Afinidad } from '../modelo/Afinidad';
import { Quiz } from '../modelo/Quiz';
import { NotifyService } from '../services/notify.service';
import { ErrorStateMatcher, MatSnackBar, MatStepper } from '@angular/material';
import { Section } from '../moderacion/moderacion.component';
import { FileService } from '../services/file.service';
import { isPlatformBrowser } from '@angular/common';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogboxComponent } from '../dialogbox/dialogbox.component';


@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {
  @ViewChild(MatStepper, { static: false }) stepper: MatStepper;

  isLoading:boolean = false;
  textoPrivado: string = "Tui quiz esta completo y correcto, ahora puedes finalizarlo y tendrás acceso a el desde tu perfil ya que marcaste la opción de Quiz privado.";
  textoPublico: string = "Tu quiz esta completo y correcto, como no marcaste la opción de Quiz privado, ahora puedes publicarlo y pasará a moderación, donde la comunidad de usuarios comprobará que cumple con las normas mencionadas anteriormente, y de ser así, será accesible para todo el mundo.";
  panelOpenState = false;
  correctas: Section[] = [
    {
      name: 'La opción de Quiz privado, permite que el quiz no vaya a moderación ni se publique, solo tendrás acceso desde tu perfil y podrás compartirlo con tus amigos'
    },
    {
      name: 'Una afinidad de la respuesta, es como de relacionada está esa respuesta con una solución.'
    },
    {
      name: 'Al ir eligiendo las respuestas, se va sumando las afinidades de la respuesta para ir acercando a una solución u otra.'
    },
    {
      name: 'Si no eliges la opción de privado, el quiz pasará a Moderación, donde otros usuarios votaran tu quiz, y cuando pasen 24 horas se decidirá si se publica o no. '
    }
  ];
  //PUNTO DE INFLEXION

  matcher = new ErrorStateMatcher();
  labelPosition = 'before';
  indeterminate = false;
  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;
  public errores: Array<string> = [];
  private quizCookie: Quiz = null;
  private estado: boolean = true;
  public quizzForm: FormGroup

  public files: Array<File>;
  public file: File;
  private srcFiles: Array<string>;
  private names: Array<string> = [];

  public quizPersonalidad: boolean = false;
  public quizPuntuacion: boolean = false;
  quizPersFin: boolean = false;
  quizPuntFin: boolean = false;
  //Atributos Quiz Puntuacion
  quizFormPunt: FormGroup; //Formulario
  quizPers: Quiz;
  quizPunt: Quiz; //Clase principal
  quizCookiePunt: Quiz = null; //Cookie 
  correctasPunt: Section[] = [
    { name: 'La opción de Quiz privado, permite que el quiz no vaya a moderación ni se publique, solo tendrás acceso desde tu perfil y podrás compartirlo con tus amigos' },
    { name: 'Si no eliges la opción de privado, el quiz pasará a Moderación, donde otros usuarios votaran tu quiz, y cuando pasen 24 horas se decidirá si se publica o no. ' }
  ];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private router: Router,
    private QuizService: QuizService,
    private bar: NgProgress,
    private notifyService: NotifyService,
    private fileService: FileService,
    private imageCompress: NgxImageCompressService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }



  convertImageToCanvas(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);
    return canvas;
  }

  convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/jpeg");
    return image;
  }



  b64toBlob(b64Data, contentType): Observable<Blob> {

    return Observable.create(observer => {
      this.imageCompress.compressFile(b64Data, 1, 60, 90).then(
        result => {
          result = result.replace(/^data:image\/(png|jpeg);base64,/, '')
          let sliceSize = 512
          const byteCharacters = atob(result);
          const byteArrays = [];
          for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
          const blob = new Blob(byteArrays, { type: contentType });
          observer.next(blob)
          observer.complete();
        }
      );
    });
  }

  onFileChanged(event: any, posicion: number) {
    let banner = posicion == 100 ? true : false;
    posicion = posicion == 100 ? 0 : (posicion + 1);
    let file = event.target.files[0];
    if (this.fileService.formatoValido(file) != null) {
      let b64 = null;
      var myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        b64 = myReader.result;
        this.srcFiles[posicion] = b64;
        this.b64toBlob(b64, file.type).subscribe(resp => {
          let fileNormal = this.fileService.blobToFile(resp, "temp");
          let fileReady = this.fileService.prepareFile(fileNormal);
          this.files[posicion] = fileReady;
          this.names[posicion] = fileReady.name;
          let aBorrar = banner ? 'banner' : 'si' + posicion;
          this.errores.splice(this.errores.indexOf(aBorrar), 1)
        })
      }
      myReader.readAsDataURL(file);
    } else {
      this.notifyService.notify("Los formatos aceptados son PNG,JPG,JPEG", "error");
    }
  }

  ngOnInit() {

  }



  //Quiz personalidad


  iniciaQuizPersonalidad() {
    this.isLoading = true;
    this.quizPers = new Quiz(null, null, null, null, null, null, null, 0, null, 1);
    this.quizPersonalidad = true;
    this.quizPuntuacion = false;
    this.quizPunt = null;
    this.quizCookiePunt = null;
    this.files = [];
    this.files.push(null);
    this.srcFiles = [];
    if (isPlatformBrowser(this.platformId)) {
      this.quizCookie = JSON.parse(localStorage.getItem("quizCookie"));
      localStorage.removeItem("quizCookiePunt");
    }
    this.createForm();
  }

  createForm() {
    let titulo = this.quizCookie != null ? this.quizCookie.titulo : null;
    let cp = this.quizCookie != null ? this.quizCookie.preguntas.length : 4;
    let cs = this.quizCookie != null ? this.quizCookie.soluciones.length : 2;

    this.quizzForm = new FormGroup({
      titulo: new FormControl(titulo, [Validators.required, Validators.minLength(10), Validators.maxLength(75)]),
      cp: new FormControl(cp, [Validators.required, Validators.min(4), Validators.max(10)]),
      cs: new FormControl(cs, [Validators.required, Validators.min(2), Validators.max(5)]),
      banner: new FormControl(null, [Validators.required]),
      privado: new FormControl(null, [])
    });
    if (this.quizCookie != null) {
      this.generaSoluciones(true);
      this.generaPreguntas(true);
    }
    this.isLoading = false;
  }



  //Generación de las soluciones form al pulsar el boton o por tener cookie
  generaSoluciones(cookie?: boolean) {

    let accesoGeneracion: boolean = cookie ? true : !this.quizzForm.invalid;
    if (accesoGeneracion) {

      if (!cookie) {
        this.quizPers.titulo = this.quizzForm.get('titulo').value;
        this.quizPers.generaSolucionesPers(this.quizzForm.get('cs').value);
      }else{
        this.quizPers.titulo = this.quizCookie.titulo;
        this.quizPers.soluciones = this.quizCookie.soluciones;
      }

      let grupo: any;
      for (let solucion of this.quizPers.soluciones) {

        let titulo: string = "st" + solucion.id;
        let descripcion: string = "sd" + solucion.id;
        let image: string = "si" + solucion.id;
        let tituloC: string = cookie ? this.quizCookie.soluciones[solucion.id].titulo : null;
        let descripcionC: string = cookie ? this.quizCookie.soluciones[solucion.id].descripcion : null;

        grupo = [
          { name: titulo, control: new FormControl(tituloC, [Validators.maxLength(50)]) },
          { name: descripcion, control: new FormControl(descripcionC, [Validators.maxLength(125)]) },
          { name: image, control: new FormControl(null, []) },
        ]
        grupo.forEach(f => {
          this.quizzForm.addControl(f.name, f.control)
          this.quizzForm.controls[f.name].updateValueAndValidity();
        });
      }
      if (!cookie) {
        this.guardaCookie();
        this.stepper.next();
      }
    } else if (!cookie) {
      this.quizzForm.markAllAsTouched();
      this.snackBar.open('Comprueba que todos los campos son validzos', "Cerrar", { duration: 4000, panelClass: 'snackBarWrong' });
    }

  }


  //Generación de las preguntas por el boton
  generaPreguntas(cookie?: boolean) {
    let accesoGeneracion: boolean = cookie ? true : !this.quizzForm.invalid;
    if (accesoGeneracion) {
      if (!cookie) {
        for (let solucion of this.quizPers.soluciones) {
          solucion.titulo = this.quizzForm.get('st' + solucion.id).value;
          solucion.descripcion = this.quizzForm.get('sd' + solucion.id).value;
          solucion.image = this.files[(solucion.id + 1)].name;
        }
        this.quizPers.generaPreguntas(this.quizzForm.get('cp').value);
      }else{
        this.quizPers.preguntas = this.quizCookie.preguntas;
      }

      let grupo: any;
      for (let pregunta of this.quizPers.preguntas) {

        let titulo: string = "pt" + pregunta.id;
        let cantidad: string = "pcr" + pregunta.id;

        let tituloC:string = cookie ? this.quizCookie.preguntas[pregunta.id].enunciado : null;
        let cantidadC:number = cookie ?  this.quizCookie.preguntas[pregunta.id].respuestas!=null ? this.quizCookie.preguntas[pregunta.id].respuestas.length : 0 : 0;
        grupo = [
          { name: titulo, control: new FormControl(tituloC, [Validators.required, Validators.maxLength(125)]) },
          { name: cantidad, control: new FormControl(cantidadC, [Validators.required, Validators.min(2), Validators.max(20)]) }
        ]
        grupo.forEach(f => {
          this.quizzForm.addControl(f.name, f.control);
          this.quizzForm.controls[f.name].updateValueAndValidity();
        });
        this.generaRespuestas(pregunta,true)
      }
      
      if (!cookie) {
        this.guardaCookie();
        this.stepper.next();
      }
    }else if (!cookie) {
      this.quizzForm.markAllAsTouched();
      this.snackBar.open('Comprueba que todos los campos son validzos', "Cerrar", { duration: 4000, panelClass: 'snackBarWrong' });
    }
  }


  //Generación de las respuestas form por el boton
  generaRespuestas(pregunta: Pregunta, cookie?: boolean) {
    console.log("Procedo a generar respuesta")
    console.log(pregunta)
    if (!this.quizzForm.get('pt' + pregunta.id).invalid && !this.quizzForm.get('pcr' + pregunta.id).invalid) {
      let preguntaModel = new Pregunta(pregunta.id,null,null,null);
      preguntaModel.generaRespuestas(this.quizzForm.get('pcr' + pregunta.id).value, this.quizPers.soluciones.length);
      pregunta.respuestas = preguntaModel.respuestas;
      //pregunta.generaRespuestas(this.quizzForm.get('pcr' + pregunta.id).value, this.quizPers.soluciones.length);
      let grupo: any;
      for (let respuesta of pregunta.respuestas) {
        console.log(respuesta)
        let titulo: string = "r" + respuesta.id + "p" + pregunta.id;
        let a1: string = "p" + pregunta.id + "r" + respuesta.id + "a" + 0;
        let a2: string = "p" + pregunta.id + "r" + respuesta.id + "a" + 1;
        let a3: string = "p" + pregunta.id + "r" + respuesta.id + "a" + 2;
        let a4: string = "p" + pregunta.id + "r" + respuesta.id + "a" + 3;
        let a5: string = "p" + pregunta.id + "r" + respuesta.id + "a" + 4;

        grupo = [
          { name: titulo, control: new FormControl(null, [Validators.required, Validators.maxLength(100)]) },
          { name: a1, control: new FormControl(null, []) },
          { name: a2, control: new FormControl(null, []) },
          { name: a3, control: new FormControl(null, []) },
          { name: a4, control: new FormControl(null, []) },
          { name: a5, control: new FormControl(null, []) }
        ]
        grupo.forEach(f => {
          this.quizzForm.addControl(f.name, f.control);
          if (f.name[0] == "r") {
            this.quizzForm.controls[f.name].setValidators([Validators.required, Validators.maxLength(70)]);
          }
        })
      }

      for(let pregunta of this.quizPers.preguntas){
        for(let respuesta of pregunta.respuestas){
          respuesta.enunciado = this.quizzForm.get("r"+respuesta.id+"p"+pregunta.id).value;
          for(let afinidad of respuesta.afinidades){
            if(this.quizzForm.get("p"+pregunta.id+"r"+respuesta.id+"a"+afinidad.id)!=null){
              afinidad.cantidad = this.quizzForm.get("p"+pregunta.id+"r"+respuesta.id+"a"+afinidad.id).value;
            }
          }
        }
      }

      this.guardaCookie();
    } else {
      this.quizzForm.markAllAsTouched();
      this.snackBar.open('Comprueba que todos los campos son validoscc', "Cerrar", { duration: 4000, panelClass: 'snackBarWrong' });
    }
  }

  compruebaRespCreadas() {

    if (this.quizPers != null) {
      for (let pregunta of this.quizPers.preguntas) {
        if (pregunta.respuestas == null) {
          return false;
        }
      }
      return true;
    } else if (this.quizPunt) {
      for (let pregunta of this.quizPunt.preguntas) {
        if (pregunta.respuestas == null) {
          return false;
        }
      }
      return true;
    }


  }

  goFinalizar(event) {
    let pos = event != null ? event.selectedIndex : 3;
    if (pos == 3 || event == null) {
      if (!this.quizzForm.invalid && this.quizPers != null) {
        if (this.quizPers.soluciones != null && this.quizPers.preguntas != null) {
          if (this.compruebaRespCreadas()) {
            this.quizPers.titulo = this.quizzForm.get('titulo').value;
            this.quizPers.image = this.names[0];

            for (let solucion of this.quizPers.soluciones) {
              solucion.titulo = this.quizzForm.get('st' + solucion.id).value;
              solucion.image = this.names[(solucion.id + 1)];
              solucion.descripcion = this.quizzForm.get('sd' + solucion.id).value
            }

            for (let pregunta of this.quizPers.preguntas) {
              pregunta.enunciado = this.quizzForm.get('pt' + pregunta.id).value;
              for (let respuesta of pregunta.respuestas) {
                respuesta.enunciado = this.quizzForm.get('r' + respuesta.id + 'p' + pregunta.id).value;
                for (let afinidad of respuesta.afinidades) {
                  afinidad.cantidad = this.quizzForm.get('p' + pregunta.id + 'r' + respuesta.id + 'a' + afinidad.id).value;
                }
              }
            }
            console.log(this.quizPers)
            this.quizPersFin = true;
            console.log(this.findInvalidControlsRecursive(this.quizzForm))
          } else {
            this.snackBar.open('Debes generar todas las respuestas', "Cerrar", { duration: 4000, panelClass: 'snackBarWrong' });
          }
        }
      } else {
        this.quizzForm.markAllAsTouched();
        this.snackBar.open('Te has dejado algún campo sin rellenar correctamente', "Cerrar", { duration: 4000, panelClass: 'snackBarWrong' });
      }
    }

  }


  goFinalizarPunt(event) {
    let pos = event != null ? event.selectedIndex : 3;
    if (pos == 3 || event == null) {
      if (!this.quizFormPunt.invalid && this.quizPunt != null) {
        if (this.quizPunt.soluciones != null && this.quizPunt.preguntas != null) {
          if (this.compruebaRespCreadas()) {
            this.quizPunt.titulo = this.quizFormPunt.get('titulo').value;
            this.quizPunt.image = this.names[0];

            for (let solucion of this.quizPunt.soluciones) {
              solucion.descripcion = this.quizFormPunt.get('sd' + solucion.id).value
            }

            for (let pregunta of this.quizPunt.preguntas) {
              pregunta.enunciado = this.quizFormPunt.get('pt' + pregunta.id).value;
              for (let respuesta of pregunta.respuestas) {
                respuesta.enunciado = this.quizFormPunt.get('r' + respuesta.id + 'p' + pregunta.id).value;
              }
            }

            this.quizPuntFin = true;
          } else {
            this.snackBar.open('Debes generar todas las respuestas', "Cerrar", { duration: 4000, panelClass: 'snackBarWrong' });
          }
        }
      } else {
        this.quizFormPunt.markAllAsTouched();
        this.snackBar.open('Te has dejado algún campo sin rellenar correctamente', "Cerrar", { duration: 4000, panelClass: 'snackBarWrong' });
      }
    }
    this.guardaCookiePunt();
  }



  //Busqueda de controles con errores
  findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    }
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

  compruebaValidaciones() {
    this.errores = this.findInvalidControlsRecursive(this.quizzForm);
    this.quizzForm.markAllAsTouched();
    this.estado = !this.quizzForm.invalid;
    if (this.estado) {
      this.onSubmit();
    } else {
      this.notifyService.notify("No dejes ningún campo vacio", "error");
    }
  }





  //Generación de ids según necesidad
  makeId() {
    var text = Math.random().toString(36).substring(2);
    return text;
  }

  //Preparo las soluciones para el modelo Quizz
  preparaSoluciones(cookie?: boolean): Array<Solucion> {
    let soluciones: Array<Solucion> = [];
    let solcant = this.quizzForm.value.cs;
    for (let i = 1; i <= solcant; i++) {
      let solucion: Solucion = new Solucion(null, null, null, null, null);
      let id = i;
      solucion.id = id;
      solucion.titulo = this.quizzForm.value['st' + id];
      solucion.descripcion = this.quizzForm.value['sd' + id];
      if (!cookie) {
        solucion.image = this.files[id].name;
      }
      soluciones.push(solucion);
    }
    return soluciones;
  }
  //Preparo las preguntas para el modelo Quizz
  preparaPreguntas(): Array<Pregunta> {
    let preguntas: Array<Pregunta> = [];
    let precant = this.quizzForm.value.cp;
    for (let i = 1; i <= precant; i++) {
      let pregunta: Pregunta = new Pregunta(null, null, null, null);
      let id = i;

      let cantidad = this.quizzForm.value['pcr' + id];
      pregunta.id = id;
      pregunta.enunciado = this.quizzForm.value['pt' + id];
      pregunta.respuestas = this.preparaRespuestas(id, cantidad);
      preguntas.push(pregunta);
    }
    return preguntas;
  }
  //Preparo las respuestas para el modelo Quizz
  preparaRespuestas(idp: number, cantidad: number): Array<Respuesta> {
    let respuestas: Array<Respuesta> = [];

    for (let i = 1; i <= cantidad; i++) {
      let afinidades: Array<Afinidad> = [];
      let respuesta = new Respuesta(i, null, idp, null, null)
      let id = i;
      respuesta.enunciado = this.quizzForm.value['r' + id + 'p' + idp];
      respuesta.afinidades = this.preparaAfinidades(idp, i);
      respuestas.push(respuesta);
    }
    return respuestas;



  }
  //Preparo las afinidades para el modelo Quizz
  preparaAfinidades(idp: number, idr: number): Array<Afinidad> {
    let afinidades: Array<Afinidad> = []
    let cs = this.quizzForm.value.cs;
    for (let i = 1; i <= cs; i++) {
      let afinidad: Afinidad = new Afinidad(idr, i, null, null);
      afinidad.cantidad = this.quizzForm.value['p' + idp + 'rs' + idr + 'a' + i];
      if (afinidad.cantidad == null) {
        afinidad.cantidad = 0;
      }
      afinidades.push(afinidad);
    }
    return afinidades;
  }
  //Envio de formulario
  onSubmit() {
    let privado: string = null;
    if (this.quizzForm.value.privado) {
      privado = this.makeId();
    }

    if (this.authService.isLoggedIn()) {
      //this.quizz = new Quiz(null, this.authService.getAuthUserId(), null, titulo, this.files[0].name, this.preparaSoluciones(), this.preparaPreguntas(), 0, null, 1);
      this.quizPers.creador = this.authService.getAuthUserId();
      this.quizPers.image = this.files[0].name;

      this.QuizService.createQuiz(this.quizPers, this.files, privado)
        .subscribe(resp => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem("quizCookie");
          }
          this.notifyService.notify("¡Hora de mostrarle esta maravilla al mundo!", "success");
          this.router.navigate(['perfil', this.authService.getAuthUserNickname()])
        })
    } else {
      this.openDialog(2);
    }


  }


  guardaCookie() {
    console.log(this.quizPers);
    /*let quizCookie: Quiz;
    quizCookie = new Quiz(null, this.authService.getAuthUserId(), null, this.quizzForm.value.titulo, null,
      this.preparaSoluciones(true), this.preparaPreguntas(), 0, null, 1); 1*/
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("quizCookie", JSON.stringify(this.quizPers));
    }
  }
  reiniciaQuiz() {
    this.files = [];
    this.srcFiles = [];
    this.errores = [];
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("quizCookie");
    }
    if (this.quizzForm) {
      this.quizzForm.reset();
    }

  }

  openDialog(opcion: number) {
    let textos: Array<string> = ["En el quiz de personalidad todas las respuestas son correctas y hay varias soluciones, estas respuestas te irán acercando a una solución u otra según como lo configures", "En el quiz de puntuación, podrás elegir cual es la respuesta correcta para que el usuario vaya obteniendo puntos hasta completar el quiz", "Para terminar de crear el quiz tienes que iniciar sesión, no te preocupes, cuando vuelvas estará aún aquí. (A excepción de las imagenes)"];

    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {

    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      title: textos[opcion]
    };
    const dialogRef = this.dialog.open(DialogboxComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => this.aceptar(data, opcion)
    );
  }
  aceptar(accion: boolean, opcion: number) {
    if (accion) {
      switch (opcion) {
        case 0:
          this.iniciaQuizPersonalidad();
          break;
        case 1:
          this.iniciaQuizPuntuacion();
          break;
        case 2:
          this.guardaCookie();
          this.router.navigate(['auth/login']);
          break;
      }

    }
  }



  //Creación de un Quiz de PUNTUACIÓN

  iniciaQuizPuntuacion() {
    this.reiniciaQuiz();
    this.quizPersonalidad = false;
    this.quizPunt = new Quiz(null, null, null, null, null, null, null, 0, null, 2);
    if (isPlatformBrowser(this.platformId)) {
      this.quizCookiePunt = JSON.parse(localStorage.getItem("quizCookiePunt"));
      localStorage.removeItem("quizCookie");
    }
    this.createFormPunt();
  }

  reiniciaQuizPunt() {
    this.files = [];
    this.errores = [];
    this.srcFiles = [];
    this.quizPunt = null;
    this.quizCookiePunt = null;
    this.quizFormPunt.reset();
    this.createFormPunt();
    this.quizFormPunt.updateValueAndValidity();

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("quizCookiePunt");
    }

  }

  guardaCookiePunt() {
    this.guardaProgresoPunt();
    let quizCookiePunt: Quiz;
    quizCookiePunt = new Quiz(null, this.authService.getAuthUserId(), this.authService.getAuthUserNickname(), this.quizFormPunt.get('titulo').value
      , null, this.quizPunt.soluciones, this.quizPunt.preguntas, 0, null, 2)
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("quizCookiePunt", JSON.stringify(quizCookiePunt));
    }
  }

  createFormPunt() {
    let titulo = this.quizCookiePunt != null ? this.quizCookiePunt.titulo : null;
    let cp = this.quizCookiePunt != null ? this.quizCookiePunt.preguntas.length : 5;

    this.quizFormPunt = new FormGroup({
      titulo: new FormControl(titulo, [Validators.required, Validators.minLength(10), Validators.maxLength(75)]),
      cp: new FormControl(cp, [Validators.min(5), Validators.max(20)]),
      banner: new FormControl(null, [Validators.required]),
      privado: new FormControl(null, [])
    });
    this.quizPuntuacion = true;
    console.log(this.quizPuntuacion)
    if (this.quizCookiePunt) {
      this.generaPreguntasPuntForm(true);
      this.generaSolucionesPuntForm(true);

    }
  }


  generaPreguntasPuntForm(cookie?: boolean) {
    if (cookie) {
      this.quizPunt = new Quiz(null, null, null, this.quizFormPunt.get('titulo').value, null, this.quizCookiePunt.soluciones, this.quizCookiePunt.preguntas, 0, null, 2)
    } else {
      this.quizPunt = new Quiz(null, null, null, this.quizFormPunt.get('titulo').value, null, null, null, 0, null, 2)
      this.quizPunt.generaPreguntas(this.quizFormPunt.get('cp').value);
    }

    if (this.quizPunt.preguntas.length > 1 && this.quizPunt.preguntas.length < 11) {
      this.bar.start();
      let grupo: any
      for (let i = 0; i < this.quizPunt.preguntas.length; i++) {
        let titulo: string = "pt" + i;
        let cantidad: string = "pcr" + i;
        let tituloC = cookie ? this.quizCookiePunt.preguntas[i].enunciado : null;
        let cantidadC = cookie && this.quizCookiePunt.preguntas[i].respuestas != null ? this.quizCookiePunt.preguntas[i].respuestas.length : null;
        grupo = [
          { name: titulo, control: new FormControl(tituloC, [Validators.required, Validators.maxLength(125)]) },
          { name: cantidad, control: new FormControl(cantidadC, [Validators.required, Validators.min(2), Validators.max(20)]) }
        ]
        grupo.forEach(f => {
          this.quizFormPunt.addControl(f.name, f.control);
          this.quizFormPunt.controls[f.name].updateValueAndValidity();
        });
        //Si hay cookie, genero formulario de respuestas ya
        if (cookie) {
          this.generaRespuestasPunt(i, true);
        }


      }
      if (!cookie) {
        this.stepper.next();
      }

      this.bar.done();
    } else {
      this.notifyService.notify("El máximo de preguntas son 10, y el mínimo son 2", "error");
    }
  }



  generaRespuestasPunt(id: number, cookie?: boolean) {
    let cantidad = cookie && this.quizCookiePunt.preguntas[id].respuestas != null ? this.quizPunt.preguntas[id].respuestas.length : this.quizFormPunt.value["pcr" + id];
    this.bar.start();
    let grupo: any;
    for (let i = 0; i < cantidad; i++) {
      let titulo: string = "r" + i + "p" + id;
      let tituloC = cookie ? this.quizCookiePunt.preguntas[id].respuestas[i].enunciado : null;

      grupo = [
        { name: titulo, control: new FormControl(tituloC, [Validators.required, Validators.maxLength(70)]) }
      ]
      grupo.forEach(f => {
        this.quizFormPunt.addControl(f.name, f.control)
        this.quizFormPunt.controls[f.name].setValidators([Validators.required]);
        this.quizFormPunt.controls[f.name].updateValueAndValidity();
      });
    }

    this.bar.done();
    this.quizFormPunt.updateValueAndValidity();
    if (!cookie) {
      let respuestas: Array<Respuesta> = []
      for (let i = 0; i < cantidad; i++) {
        let resp: Respuesta = new Respuesta(i, null, null, null, (i == 0 ? true : false));
        respuestas.push(resp);
      }
      this.quizPunt.preguntas[id].respuestas = respuestas;
      this.quizPunt.preguntas[id].enunciado = this.quizFormPunt.get("pt" + id).value;
      this.guardaCookiePunt();
    }


  }

  generaSolucionesPuntForm(cookie?: boolean) {
    this.bar.start();
    if (!cookie || this.quizPunt.soluciones == null) {
      this.quizPunt.generaSoluciones();
    }
    let grupo: any;
    for (let solucion of this.quizPunt.soluciones) {
      let desc: string = "sd" + solucion.id;
      let valor: string = cookie && this.quizPunt.soluciones != null ?
        this.quizPunt.soluciones[solucion.id].descripcion : null;
      grupo = [
        { name: desc, control: new FormControl(valor, [Validators.required, Validators.maxLength(125)]) }
      ]
      grupo.forEach(f => {
        this.quizFormPunt.addControl(f.name, f.control)
        this.quizFormPunt.controls[f.name].setValidators([Validators.required]);
        this.quizFormPunt.controls[f.name].updateValueAndValidity();
      });
    }
    this.guardaCookiePunt();
    this.quizFormPunt.updateValueAndValidity();
    this.bar.done();


  }

  compruebaValidacionesPunt() {
    this.errores = this.findInvalidControlsRecursive(this.quizFormPunt);
    this.quizFormPunt.markAllAsTouched();
    this.estado = !this.quizFormPunt.invalid;
    let allGenerated = true;
    for (let pregunta of this.quizPunt.preguntas) {
      if (!pregunta.respuestas) {
        allGenerated = false;
      }
    }

    if (this.estado && allGenerated) {
      return true;
    } else {
      this.notifyService.notify("No dejes ningún campo vacio", "error");
      return false;
    }
  }

  //Guarda el quiz hasta por donde esta hecho
  guardaProgresoPunt() {
    for (let pregunta of this.quizPunt.preguntas) {
      if (pregunta.respuestas != null) {
        for (let respuesta of pregunta.respuestas) {
          respuesta.enunciado = this.quizFormPunt.get('r' + respuesta.id + 'p' + pregunta.id).value;
        }
      }
    }
    if (this.quizPunt.soluciones != null) {
      for (let solucion of this.quizPunt.soluciones) {
        solucion.descripcion = this.quizFormPunt.get('sd' + solucion.id).value;
      }
    }

  }

  onSubmitPunt() {
    if (this.compruebaValidacionesPunt()) {
      this.guardaProgresoPunt();
      let privado: string = null;
      if (this.quizFormPunt.value.privado) {
        privado = this.makeId();
      }

      if (this.authService.isLoggedIn()) {
        this.quizPunt.titulo = this.quizFormPunt.get('titulo').value;
        this.quizPunt.creador = this.authService.getAuthUserId();
        this.quizPunt.nickname = this.authService.getAuthUserNickname();
        this.quizPunt.image = this.files[0].name;
        this.quizPunt.estrellas = 0;
        this.QuizService.createQuiz(this.quizPunt, this.files, privado)
          .subscribe(resp => {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.removeItem("quizCookiePunt");
            }
            this.notifyService.notify("¡Hora de mostrarle esta maravilla al mundo!", "success");
            this.router.navigate(['perfil', this.authService.getAuthUserNickname()])
          })
      } else {
        this.openDialog(2);
      }



    }
  }
}