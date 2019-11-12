import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
  forgetForm: FormGroup;
  confirmacion: string;
  mensaje: string;
  subsRouter: Subscription;
  constructor(
    private authService: AuthService,
    private routerMV: Router,
    private router: ActivatedRoute,
    private snackBar:MatSnackBar
  ) {
    this.mensaje = "Le enviaremos un correo a su dirección para restablecer la contraseña.";
  }

  ngOnInit() {
    this.subsRouter = this.router.params.subscribe((params) => {
      this.confirmacion = params['confirmacion'];
      if (this.confirmacion != null) {
        this.createForm(true);
        this.mensaje = "Introduzca la nueva contraseña deseada."
      } else {
        this.createForm(false);
      }
    })
  }

  ngOnDestroy(){
    this.subsRouter.unsubscribe();
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
      let password: string = opcion ? this.forgetForm.get('firstPass').value : null;
      let email: string = opcion ? null : this.forgetForm.get('email').value;
      this.authService.forgetPassword(email, password,this.confirmacion)
        .subscribe((res) => {
          if (res) {
            this.snackBar.open('La contraseña se ha restablecido con exito.', "Cerrar", { duration: 4000, panelClass: 'snackBarSuccess' });
            this.routerMV.navigate(['/auth/login']);
          } else {
            this.mensaje = "Hemos enviado un correo a la dirección que ha proporcionado para la recuperación de su contraseña."
          }

        })
    }else{
      this.snackBar.open('Comprueba que todos los campos son validos', "Cerrar", { duration: 4000, panelClass: 'snackBarWrong' });
    }
  }

}
