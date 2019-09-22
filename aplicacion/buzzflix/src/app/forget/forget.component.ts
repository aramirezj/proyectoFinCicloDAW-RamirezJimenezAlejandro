import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
  forgetForm: FormGroup;
  confirmacion: String;
  mensaje: String;
  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private routerMV: Router,
    private router: ActivatedRoute
  ) {
    this.mensaje = "Le enviaremos un correo a su dirección para restablecer la contraseña.";
  }

  ngOnInit() {

    this.router.params.subscribe((params) => {
      this.confirmacion = params['confirmacion'];
      if (this.confirmacion != null) {
        this.createForm(true);
        this.mensaje = "Introduzca la nueva contraseña deseada."
      } else {
        this.createForm(false);
      }
    })
  }

  createForm(opcion: Boolean) {
    if (!opcion) {
      this.forgetForm = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email])
      });
    } else {
      this.forgetForm = new FormGroup({
        firstPass: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
        secondPass: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)])
      })
    }

  }

  onSubmit(opcion: Boolean) {
    if (!this.forgetForm.invalid) {
      let password: String = opcion ? this.forgetForm.get('firstPass').value : null;
      let email: String = opcion ? null : this.forgetForm.get('email').value;
      this.authService.forgetPassword(email, password,this.confirmacion)
        .subscribe((res) => {
          if (res) {
            this.notifyService.notify("La contraseña se ha restablecido con exito.", "success");
            this.routerMV.navigate(['/auth/login']);
          } else {
            this.mensaje = "Hemos enviado un correo a la dirección que ha proporcionado para la recuperación de su contraseña."
          }

        })
    }
  }

}
