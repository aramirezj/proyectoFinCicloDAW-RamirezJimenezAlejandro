import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Usuario } from './modelo/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public miniForm: FormGroup
  public miniForm2: FormGroup
  usuario: Usuario
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
  }

  onSubmit() {
    let nombre = this.miniForm.get('nombre').value;
    if (nombre != "") {
      $("form").addClass("hidden");
      $("i").removeClass("hidden");
      this.router.navigate(['ver/usuarios/' + nombre]);
    }else{
      $("form").addClass("hidden");
      $("i").removeClass("hidden");
    }
  }
  onSubmit2() {
    let nombre = this.miniForm2.get('nombre2').value;
    if (nombre != "") {
      $("form").addClass("hidden");
      $("i").removeClass("hidden");
      this.router.navigate(['ver/quizzes/' + nombre]);
    }else{
      $("form").addClass("hidden");
      $("i").removeClass("hidden");
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  muestraForm() {
    $("#form1").removeClass("hidden");
    $("i").addClass("hidden");
  }
  muestraForm2() {
    $("#form2").removeClass("hidden");
    $("i").addClass("hidden");
  }
}
