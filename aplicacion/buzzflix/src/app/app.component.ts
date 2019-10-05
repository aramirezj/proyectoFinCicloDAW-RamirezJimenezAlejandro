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
  @ViewChild(MatMenuTrigger, { static: true }) trigger: MatMenuTrigger;
  @ViewChild('cookieLaw', { static: true })
  private cookieLawEl: any;

  private cookieLawSeen: boolean;
  public miniForm: FormGroup
  public miniForm2: FormGroup
  usuario: Usuario
  showSU: boolean = false;
  vacio: boolean = false;
  notificaciones: Section[];
  icono: string;
  panelOpenState = false;
  panelOpenState2 = false;
  correctas: Section[] = [
  ];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.miniForm = this.fb.group({
      nombre: ['', [
      ]]
    })
    this.userService.userProfileUpdated.subscribe((usuario) => {
      this.usuario = usuario;
    })
  }

  public seeCookie(evt: any) {
    this.cookieLawSeen = evt;
  }

  ngOnInit() {
    this.cookieLawSeen = this.cookieLawEl.cookieLawSeen;
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
      this.router.navigate(['buscador/' + nombre]);
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
        .subscribe((respuesta => {
          if (respuesta != undefined) {
            for (let resp of respuesta) {
              let section: Section;
              section = {
                name: resp["mensaje"]
              }
              this.notificaciones.push(section);
            }
            if (this.notificaciones.length > 9) {
              this.icono = "filter_9_plus";
            } else {
              this.icono = "filter_" + this.notificaciones.length;
            }
          }
        }))
    }
  }

  read(notificacion) {
    this.authService.readNoti(notificacion.name)
      .subscribe();
    let index = this.notificaciones.indexOf(notificacion);
    this.notificaciones.splice(index, 1);
    if (this.notificaciones.length == 0) {
      this.vacio = true;
    } else {
      if (this.notificaciones.length > 9) {
        this.icono = "filter_9_plus";
      } else {
        this.icono = "filter_" + this.notificaciones.length;
      }
    }
  }
}
