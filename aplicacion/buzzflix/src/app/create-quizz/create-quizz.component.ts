import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { QuizzService } from '../services/quizz.service';
import { Solucion } from '../modelo/Solucion';
import { NgProgress } from 'ngx-progressbar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Pregunta } from '../modelo/Pregunta';
import { Respuesta } from '../modelo/Respuesta';
import { Afinidad } from '../modelo/Afinidad';
import { Quizz } from '../modelo/Quizz';
import { NotifyService } from '../services/notify.service';
import * as $ from 'jquery';
import { ErrorStateMatcher } from '@angular/material';
import { Section } from '../moderacion/moderacion.component';
import { FileService } from '../services/file.service';
import { isPlatformBrowser } from '@angular/common';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-quizz',
  templateUrl: './create-quizz.component.html',
  styleUrls: ['./create-quizz.component.scss']
})
export class CreateQuizzComponent implements OnInit {
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
  checked = false;
  labelPosition = 'before';
  indeterminate = false;
  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;
  private errores: Array<string> = [];
  private quizCookie: Quizz = null;
  private quizz: Quizz;
  private estado: boolean = true;
  private max: number
  private maxp: number
  private maxr: number
  private maxs: number
  private learray: Array<Array<Number>>
  private verdades: any
  public preguntas: Array<Object>
  public respuestas: Array<Object>
  public quizzForm: FormGroup
  public firstStep: boolean = false
  public secondStep: boolean = false
  public thirdStep: boolean = false;
  public aux: number = 0;


  public files: Array<File>;
  public file: File;
  private names: Array<string> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private router: Router,
    private quizzService: QuizzService,
    private bar: NgProgress,
    private notifyService: NotifyService,
    private fileService: FileService,
    private imageCompress: NgxImageCompressService
  ) {

    this.files = [];
    this.max = 0;
    this.verdades = [];
    this.learray = [];
    this.learray[0] = null;
    this.verdades[0] = []
    for (let i = 0; i < 10; i++) {
      this.verdades[i] = { creada: false, respuestas: [] };
    }
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 20; j++) {
        this.verdades[i].respuestas[j] = { generado: false, mostrado: false };
      }

    }
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
    posicion = posicion == 100 ? 0 : posicion + 1;
    let file = event.target.files[0];

    if (this.fileService.formatoValido(file) != null) {
      let b64 = null;
      var myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        b64 = myReader.result;
        this.b64toBlob(b64, file.type).subscribe(resp => {
          let fileNormal = this.fileService.blobToFile(resp, "temp");
          let fileReady = this.fileService.prepareFile(fileNormal);
          this.files[posicion] = fileReady;
          this.names[posicion] = fileReady.name;
          if (!banner) {
            let destino: any = $("#img" + (posicion - 1))[0];
            var reader = new FileReader();
            reader.onload = function (event) {
              let target: any = event.target;
              destino.src = target.result;
            };
            reader.readAsDataURL(fileReady);
            this.errores.splice(this.errores.indexOf("si" + (posicion)))
            let button = $("#si" + (posicion))[0];
            button.className = "fileUpload btn btn-success"
          }
        })
      }
      myReader.readAsDataURL(file);
    } else {
      this.notifyService.notify("Los formatos aceptados son PNG,JPG,JPEG", "error");
    }
  }



  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.quizCookie = JSON.parse(localStorage.getItem("quizCookie"));
    }
    this.createForm();
  }

  createForm() {

    let titulo = this.quizCookie != null ? this.quizCookie.titulo : null;
    let cp = this.quizCookie != null ? this.quizCookie.preguntas.length : null;
    let cs = this.quizCookie != null ? this.quizCookie.soluciones.length : null;

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
  }

  //Generación de las soluciones al pulsar el boton
  generaSoluciones(cookie?: boolean) {
    this.aux = this.quizzForm.get('cs').value;
    this.quizzForm.value.privado;
    if (this.aux > 1 && this.aux < 6) {
      this.reseteaCondRespuestas();
      this.secondStep = false;
      this.bar.start();
      let grupo: any
      this.aux = cookie ? this.quizCookie.soluciones.length : this.aux;
      for (let i = 1; i <= this.aux; i++) {
        let titulo: string = "st" + i;
        let descripcion: string = "sd" + i;
        let image: string = "si" + i;

        let tituloC = cookie ? this.quizCookie.soluciones[(i - 1)].titulo : null;
        let descripcionC = cookie ? this.quizCookie.soluciones[(i - 1)].descripcion : null;

        grupo = [
          { name: titulo, control: new FormControl(tituloC, [Validators.required, Validators.maxLength(50)]) },
          { name: descripcion, control: new FormControl(descripcionC, [Validators.maxLength(125)]) },
          { name: image, control: new FormControl(null, [Validators.required]) },
        ]
        grupo.forEach(f => {
          this.quizzForm.addControl(f.name, f.control)
          this.quizzForm.controls[f.name].updateValueAndValidity();
        });
      }
      this.firstStep = true;
      this.max = this.quizzForm.get('cs').value;
      this.bar.done();
    } else {
      this.notifyService.notify("El máximo de soluciones son 5, y el mínimo son 2", "error");
    }


  }


  //Generación de las preguntas por el boton
  generaPreguntas(cookie?: boolean) {
    let verdad = true;
    for (let i = 1; i <= this.quizzForm.get('cs').value; i++) {
      if (this.quizzForm.get('st' + i).status == "INVALID") {
        verdad = false;
      }
    }
    this.aux = cookie ? this.quizCookie.preguntas.length : this.quizzForm.get('cp').value;
    if (verdad) {
      if (this.aux > 1 && this.aux < 11) {
        this.bar.start();
        this.reseteaFullRespuestas();
        let grupo: any
        for (let i = 1; i <= this.aux; i++) {
          let titulo: string = "pt" + i;
          let cantidad: string = "pcr" + i;
          let tituloC = cookie ? this.quizCookie.preguntas[(i - 1)].enunciado : null;
          let cantidadC = cookie ? this.quizCookie.preguntas[(i - 1)].respuestas.length : null;

          grupo = [
            { name: titulo, control: new FormControl(tituloC, [Validators.required, Validators.maxLength(125)]) },
            { name: cantidad, control: new FormControl(cantidadC, [Validators.required, Validators.max(20)]) }
          ]
          grupo.forEach(f => {
            this.quizzForm.addControl(f.name, f.control);
            this.quizzForm.controls[f.name].updateValueAndValidity();
            let eje = i;
            eje--;
            this.verdades[eje].creada = true;
          });

          if (cookie) {
            if (this.quizCookie.preguntas[(i - 1)].respuestas.length > 0) {
              this.generaRespuestas(i, true);
            }
          }

        }
        this.secondStep = true;
        this.maxp = cookie ? this.quizCookie.preguntas.length : this.quizzForm.get('cp').value;
        this.bar.done();
      } else {
        this.notifyService.notify("El máximo de preguntas son 10, y el mínimo son 2", "error");
      }
    } else {
      this.notifyService.notify("Por favor, rellena al menos los titulos de las soluciones (máximo 50 caracteres)", "error");
    }
  }


  //Generación de las respuestas por el boton

  generaRespuestas(id: number, cookie?: boolean) {
    if (!cookie) { this.guardaCookie() };
    this.maxs = this.quizzForm.get('cs').value;
    this.maxr = this.quizzForm.value["pcr" + id];
    if (this.quizzForm.get('pt' + id).status == "INVALID") {
      this.notifyService.notify("Los titulos de las preguntas son obligatorios", "error");
    } else {
      if (this.maxr < 21 && this.maxr > 1) {
        this.thirdStep = true;
        this.reseteaRespuestas(id);
        this.bar.start();
        let grupo: any;
        let listita = [];

        let aux = cookie ? this.quizCookie.preguntas[(id - 1)].respuestas.length : this.maxr;

        for (let i = 1; i <= aux; i++) {
          let titulo: string = "r" + i + "p" + id;
          let a1: string = "p" + id + "rs" + i + "a" + 1;
          let a2: string = "p" + id + "rs" + i + "a" + 2;
          let a3: string = "p" + id + "rs" + i + "a" + 3;
          let a4: string = "p" + id + "rs" + i + "a" + 4;
          let a5: string = "p" + id + "rs" + i + "a" + 5;
          let tituloC = cookie ? this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].enunciado : null;
          let a1C = cookie && this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].afinidades[0] != null ? this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].afinidades[0].cantidad : 0;
          let a2C = cookie && this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].afinidades[1] != null ? this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].afinidades[1].cantidad : 0;
          let a3C = cookie && this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].afinidades[2] != null ? this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].afinidades[2].cantidad : 0;
          let a4C = cookie && this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].afinidades[3] != null ? this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].afinidades[3].cantidad : 0;
          let a5C = cookie && this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].afinidades[4] != null ? this.quizCookie.preguntas[(id - 1)].respuestas[(i - 1)].afinidades[4].cantidad : 0;

          grupo = [
            { name: titulo, control: new FormControl(tituloC, []) },
            { name: a1, control: new FormControl(a1C, []) },
            { name: a2, control: new FormControl(a2C, []) },
            { name: a3, control: new FormControl(a3C, []) },
            { name: a4, control: new FormControl(a4C, []) },
            { name: a5, control: new FormControl(a5C, []) },
          ]
          grupo.forEach(f => {
            this.quizzForm.addControl(f.name, f.control)
            if (f.name[0] == "r") {
              this.quizzForm.controls[f.name].setValidators([Validators.required, Validators.maxLength(70)]);
            }

            this.quizzForm.controls[f.name].updateValueAndValidity();
            let eje = i;
            eje--;
            let aux2 = id;
            aux2--;
            this.verdades[aux2].respuestas[eje].generado = true;
            listita.push(eje);
          });

        }
        let aux3 = id;
        aux3--;
        this.generaArray(aux3);
        for (let x = 0; x < listita.length; x++) {
          let aux2 = id;
          aux2--;
          this.verdades[aux2].respuestas[listita[x]] = { generado: true, mostrado: true }
        }
        this.maxr = cookie ? this.quizCookie.preguntas[(id - 1)].respuestas.length : this.quizzForm.get('pcr' + id).value;
        this.bar.done();
        this.quizzForm.updateValueAndValidity();

      } else {
        this.notifyService.notify("El máximo de respuestas es 20 y el mínimo 2, ¿Razonable no?", "error");
      }
    }



  }





  //Reseteo las respuestas de cierta pregunta
  reseteaRespuestas(id: number) {
    id--;
    for (let i = 0; i < 10; i++) {
      this.verdades[id].respuestas[i] = { generado: false, mostrado: false };
    }
  }
  //Reseteo todas las respuestas de todas las preguntas dejando las preguntas creadas
  reseteaCondRespuestas() {
    for (let i = 0; i < 10; i++) {
      if (this.verdades[i].creada) {
        this.verdades[i] = { creada: true, respuestas: [] };
      } else {
        this.verdades[i] = { creada: false, respuestas: [] };
      }
    }

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 20; j++) {
        this.verdades[i].respuestas[j] = { generado: false, mostrado: false };
      }
    }
  }
  //Reseteo todas las preguntas y respuestas
  reseteaFullRespuestas() {
    for (let i = 0; i < 10; i++) {
      this.verdades[i] = { creada: false, respuestas: [] };
    }
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 20; j++) {
        this.verdades[i].respuestas[j] = { generado: false, mostrado: false };
      }
    }
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
    for (let error of this.errores) {
      for (let i = 1; i <= this.quizzForm.get("cs").value; i++) {
        if (error == "si" + i) {
          let button = $("#si" + i)[0];
          button.className = "fileUpload btn btn-success error"

        }
      }
    }

    this.quizzForm.markAllAsTouched();
    this.estado = !this.quizzForm.invalid;
    let minimo = this.compruebaRespuestasMinimas();
    if (this.estado && minimo) {
      this.notifyService.notify("¡Hora de mostrarle esta maravilla al mundo!", "success");
      this.onSubmit();
    } else {
      this.notifyService.notify("No dejes ningún campo vacio", "error");
    }
  }

  compruebaRespuestasMinimas() {
    let verdad = true;
    for (let i = 0; i < this.verdades.length; i++) {
      if (this.verdades[i].creada) {
        if (!this.verdades[i].respuestas[1].mostrado)
          verdad = false;
      }
    }
    return verdad;
  }



  //Generación de ids según necesidad
  makeId() {
    var text = Math.random().toString(36).substring(2);
    return text;
  }
  generaId(letra: string, i: number) {
    i++;
    return letra + i;
  }
  generaIdR(letra1: string, id1: number, letra2: string, id2: number) {
    id2++;
    return letra1 + id1 + letra2 + id2;
  }
  generaIdRR(letra0: string, id0: number, letra1: string, id1: number, letra2: string, id2: number) {
    id2++;
    id0++;
    return letra0 + id0 + letra1 + id1 + letra2 + id2;
  }

  //Genera Array para el maximo de las respuestas
  generaArray(pos: number) {
    let aux = this.maxr + 1;
    let array = Array(aux).fill(0).map((x, i) => i);
    array.shift();
    this.learray[pos] = array;
  }




  //Preparo las soluciones para el modelo Quizz
  preparaSoluciones(cookie?: boolean): Array<Solucion> {
    let soluciones: Array<Solucion> = [];
    let solcant = this.quizzForm.value.cs;
    for (let i = 1; i <= solcant; i++) {
      let solucion: Solucion = new Solucion(null, null, null, null);
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
      let respuesta = new Respuesta(i, null, idp, null)
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
      let afinidad: Afinidad = new Afinidad(idr, i, null);
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
    let titulo = this.quizzForm.value.titulo;
    let privado: string = null;
    if (this.quizzForm.value.privado) {
      privado = this.makeId();
    }
    this.quizz = new Quizz(null, this.authService.getAuthUserId(), null, titulo, this.files[0].name, this.preparaSoluciones(), this.preparaPreguntas(), 0, null);
    this.quizzService.createQuizz(this.quizz, this.files, privado)
      .subscribe(resp => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem("quizCookie");
        }
        this.router.navigate(['perfil', this.authService.getAuthUserNickname()])
      })
  }


  guardaCookie() {
    let quizCookie: Quizz;
    quizCookie = new Quizz(null, this.authService.getAuthUserId(), null, this.quizzForm.value.titulo, null,
      this.preparaSoluciones(true), this.preparaPreguntas(), 0, null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("quizCookie", JSON.stringify(quizCookie));
    }

  }
}