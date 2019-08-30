import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
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
import { MatSelectModule } from '@angular/material/select';
import * as $ from 'jquery';
export interface Numero {
  value: number;
  viewValue: number;
}
@Component({
  selector: 'app-create-quizz',
  templateUrl: './create-quizz.component.html',
  styleUrls: ['./create-quizz.component.scss']
})
export class CreateQuizzComponent implements OnInit {
  //PUNTO DE INFLEXION
  numeros: Numero[] = [
    { value: 0, viewValue: 0 },
    { value: 1, viewValue: 1 },
    { value: 2, viewValue: 2 }
  ];
  checked = false;
  labelPosition = 'before';
  indeterminate = false;
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private quizzService: QuizzService,
    private bar: NgProgress,
    private ref: ChangeDetectorRef,
    private notifyService: NotifyService,
  ) {

    this.files = [];
    this.createForm();
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
  onFileChanged(event: any, n: number) {
    console.log(n)
    let verdad = true;
    let nameInput = event.target.getAttribute("ng-reflect-name");
    if (n != 50) {
      n++;
    } else {
      n = 0;
      verdad = false;;
    }

    const file = event.target.files[0];
    let formato = file.name.split(".")[1];
    let aux = formato.toUpperCase();
    if (aux === "JPG" || aux === "JPEG" || aux === "PNG") {
      Object.defineProperty(file, "name", {
        value: this.makeId() + "." + formato,
        writable: false
      })
      this.files[n] = file;
      if (verdad) {
        n--;
        let destino: any = $("#img" + n)[0];
        var reader = new FileReader();
        reader.onload = function (event) {
          let target: any = event.target;
          destino.src = target.result;
        };
        reader.readAsDataURL(file);
        destino.src = file;
      }

    } else {
      this.notifyService.notify("Los formatos aceptados son PNG,JPG,JPEG", "error");
      this.quizzForm.get(nameInput).reset();
    }

  }

  createForm() {

    this.quizzForm = this.fb.group({
      titulo: ['', [
        Validators.required,
        Validators.minLength(1)
      ]],
      cp: ['', [
        Validators.required,
        Validators.min(2),
        Validators.max(10)

      ]],
      cs: ['', [
        Validators.required,
        Validators.min(2),
        Validators.max(5)
      ]],
      banner: ['', [
        Validators.required,
      ]],
      privado: ['', [

      ]]

    });
  }

  ngOnInit() {
    this.max = 0;
  }


  //Generación de las soluciones al pulsar el boton
  generaSoluciones() {
    this.aux = this.quizzForm.get('cs').value;
    this.quizzForm.value.privado;
    if (this.aux > 1 && this.aux < 6) {
      this.reseteaCondRespuestas();
      this.secondStep = false;
      this.ref.detach();
      this.bar.start();
      let grupo: any

      for (let i = 1; i <= this.aux; i++) {
        let titulo: string = "st" + i;
        let descripcion: string = "sd" + i;
        let image: string = "si" + i;
        grupo = [
          { name: titulo, control: new FormControl(null, []) },
          { name: descripcion, control: new FormControl(null, []) },
          { name: image, control: new FormControl(null, []) },
        ]
        grupo.forEach(f => {
          this.quizzForm.addControl(f.name, f.control)
          this.quizzForm.controls[f.name].setValidators([Validators.required]);
          this.quizzForm.controls[f.name].updateValueAndValidity();

        });
      }
      this.firstStep = true;
      setTimeout(() => {
        this.max = this.quizzForm.get('cs').value;
        this.ref.detectChanges();
        this.bar.done();
      }, 500);
    } else {
      this.notifyService.notify("El máximo de soluciones son 5, y el mínimo son 2", "error");
    }


  }


  //Generación de las preguntas por el boton
  generaPreguntas() {

    let verdad = true;
    for (let i = 1; i <= this.quizzForm.get('cs').value; i++) {
      if (this.quizzForm.get('st' + i).value == null) {
        verdad = false;
      }
    }
    this.aux = this.quizzForm.get('cp').value;
    if (verdad) {
      if (this.aux > 1 && this.aux < 11) {
        this.reseteaFullRespuestas();
        this.ref.detach();
        this.bar.start();
        let grupo: any
        this.aux = this.quizzForm.get('cp').value;
        for (let i = 1; i <= this.aux; i++) {
          let titulo: string = "pt" + i;
          let descripcion: string = "pcr" + i;
          grupo = [
            { name: titulo, control: new FormControl(null, []) },
            { name: descripcion, control: new FormControl(null, []) }
          ]
          grupo.forEach(f => {
            this.quizzForm.addControl(f.name, f.control);
            this.quizzForm.controls[f.name].setValidators([Validators.required]);
            this.quizzForm.controls[f.name].updateValueAndValidity();
            let eje = i;
            eje--;
            this.verdades[eje].creada = true;
          });
        }
        this.secondStep = true;
        setTimeout(() => {
          this.maxp = this.quizzForm.get('cp').value;
          this.ref.detectChanges();
          this.bar.done();
        }, 500);
      } else {
        this.notifyService.notify("El máximo de preguntas son 10, y el mínimo son 2", "error");
      }
    }else{
      this.notifyService.notify("Por favor, rellena al menos los titulos de las soluciones", "error");
    }



  }


  //Generación de las respuestas por el boton
  generaRespuestas(id: number) {
    this.maxs = this.quizzForm.get('cs').value;
    this.maxr = this.quizzForm.value["pcr" + id];
    console.log(this)
    if (this.maxr < 21 && this.maxr > 1) {
      this.thirdStep = true;
      this.reseteaRespuestas(id);
      this.bar.start();
      let grupo: any;
      let listita = [];

      this.aux = this.maxr;
      this.quizzForm.value["pcr" + id];
      this.ref.detach();
      for (let i = 1; i <= this.aux; i++) {
        let titulo: string = "r" + i + "p" + id;
        let a1: string = "p" + id + "rs" + i + "a" + 1;
        let a2: string = "p" + id + "rs" + i + "a" + 2;
        let a3: string = "p" + id + "rs" + i + "a" + 3;
        let a4: string = "p" + id + "rs" + i + "a" + 4;
        let a5: string = "p" + id + "rs" + i + "a" + 5;
        grupo = [
          { name: titulo, control: new FormControl(null, []) },
          { name: a1, control: new FormControl(null, []) },
          { name: a2, control: new FormControl(null, []) },
          { name: a3, control: new FormControl(null, []) },
          { name: a4, control: new FormControl(null, []) },
          { name: a5, control: new FormControl(null, []) },
        ]
        grupo.forEach(f => {
          this.quizzForm.addControl(f.name, f.control)
          if (f.name[0] == "r") {
            this.quizzForm.controls[f.name].setValidators([Validators.required]);
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
      setTimeout(() => {
        for (let x = 0; x < listita.length; x++) {
          let aux2 = id;
          aux2--;
          this.verdades[aux2].respuestas[listita[x]] = { generado: true, mostrado: true }

        }
        this.maxr = this.quizzForm.get('pcr' + id).value;
        this.ref.detectChanges();
        this.bar.done();
      }, 200);
    } else {
      this.notifyService.notify("El máximo de respuestas es 20 y el mínimo 2, ¿Razonable no?", "error");
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


  compruebaValidaciones() {
    this.ref.detectChanges();
    this.estado = this.quizzForm.invalid;
    this.ref.detectChanges();
    if (!this.estado) {
      this.compruebaRespuestasMinimas();
      this.notifyService.notify("¡Hora de mostrarle esta maravilla al mundo!", "success");
      setTimeout(() => {
        this.onSubmit();
      }, 700);
    } else {
      this.notifyService.notify("No dejes ningún campo vacio", "error");
    }
  }

  compruebaRespuestasMinimas() {
    let verdad = true;
    for (let i = 0; i < this.verdades.length; i++) {
      if (this.verdades[i].creada) {
        verdad = this.verdades[i].respuestas[1].mostrado;
      }
    }
    return verdad;
  }



  //Generación de ids según necesidad
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
    this.ref.detectChanges();
  }

  makeId() {
    var text = Math.random().toString(36).substring(2);
    return text;
  }


  //Preparo las soluciones para el modelo Quizz
  preparaSoluciones(): Array<Solucion> {
    let soluciones: Array<Solucion> = [];
    let solcant = this.quizzForm.value.cs;
    for (let i = 1; i <= solcant; i++) {
      let solucion: Solucion = new Solucion(null, null, null, null);
      let id = i;
      solucion.id = id;
      solucion.titulo = this.quizzForm.value['st' + id];
      solucion.descripcion = this.quizzForm.value['sd' + id];
      solucion.image = this.files[id].name;
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
    this.quizz = new Quizz(null, this.authService.getAuthUserId(), titulo, this.files[0].name, this.preparaSoluciones(), this.preparaPreguntas(), 0, null);

    this.quizzService.createQuizz(this.quizz, this.files, privado)
      .subscribe(resp => {
        this.router.navigate(['/usuario/perfil', this.authService.getAuthUserId()])
      })
  }

}


$(document).on('change', '.up', function () {
  var names: any = [];
  var length = $(this).get(0).files.length;
  for (var i = 0; i < $(this).get(0).files.length; ++i) {
    names.push($(this).get(0).files[i].name);
  }
  // $("input[name=file]").val(names);
  if (length > 2) {
    var fileName = names.join(', ');
    $(this).closest('.form-group').find('.form-control').attr("value", length + " files selected");
  }
  else {
    $(this).closest('.form-group').find('.form-control').attr("value", names);
  }
});