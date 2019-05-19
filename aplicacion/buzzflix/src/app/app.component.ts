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
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
  }

  muestraForm() {
    $("form").removeClass("hidden");
    $("i").addClass("hidden");

  }
}
