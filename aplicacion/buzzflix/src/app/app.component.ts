import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Usuario } from './modelo/Usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { MatMenuTrigger } from '@angular/material/menu';
import * as $ from 'jquery';
export interface Section {
  name: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  public miniForm: FormGroup
  public miniForm2: FormGroup
  usuario: Usuario
  showSQ:boolean = false;
  showSU:boolean = false;
  vacio: boolean = false;
  notificaciones: Section[]
  panelOpenState = false;
  correctas: Section[] = [
  ];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {
    this.miniForm = this.fb.group({
      nombre: ['', [
      ]]
    })
    this.miniForm2 = this.fb.group({
      nombre2: ['', [
      ]]
    })
    this.userService.userProfileUpdated.subscribe((usuario) => {
      this.usuario = usuario;
    })
  }


  ngOnInit() {
    this.usuario = this.authService.getAuthUser();
    this.notificaciones = [];
    this.obtenerNotificaciones();

  }

  changeColor() {

    $(".mat-menu-content").css("background-color", "#5a458d");
    $(".mat-menu-content").css("color", "white");
    $(".mat-menu-panel").css("min-width", "350px");
  }

  onSubmit() {
    let nombre = this.miniForm.get('nombre').value;
    if (nombre != "") {
      this.showSQ=false;
      this.showSU=false;
      this.router.navigate(['ver/usuarios/' + nombre]);
    } else {
      this.showSQ=false;
      this.showSU=false;
    }
  }
  onSubmit2() {
    let nombre = this.miniForm2.get('nombre2').value;
    if (nombre != "") {
      this.showSQ=false;
      this.showSU=false;
      this.router.navigate(['ver/quizzes/' + nombre]);
    } else {
      this.showSQ=false;
      this.showSU=false;
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }
  abreMenu() {
    this.trigger.openMenu();
  }
  obtenerNotificaciones() {
    if (this.authService.isLoggedIn()) {
      this.authService.getNotificaciones()
        .then((respuesta => {
          for (let resp of respuesta) {
            let section: Section;
            section = {
              name: resp["mensaje"]
            }
            this.notificaciones.push(section);
          }
        }))
    }

  }

  read(notificacion) {
    this.authService.readNoti(notificacion.name);
    let index = this.notificaciones.indexOf(notificacion);
    this.notificaciones.splice(index, 1);
    if (this.notificaciones.length == 0) {
      this.vacio = true;
    }

  }

  muestraForm() {
    this.showSU=true;
  }
  muestraForm2() {
    this.showSQ=true;
  }


}
