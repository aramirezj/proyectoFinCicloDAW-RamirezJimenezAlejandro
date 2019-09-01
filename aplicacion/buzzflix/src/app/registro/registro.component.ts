import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NotifyService } from '../services/notify.service';


@Component({
  selector: 'app-registro2',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.registroForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      nombre: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      password2: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    if (!this.registroForm.invalid) {
      this.authService.register(this.registroForm.get('nombre').value, this.registroForm.get('email').value, this.registroForm.get('password').value)
        .subscribe((usuario) => {
          if (usuario != null) {
            this.authService.logUserIn(usuario);
          }
        })
    }
  }





















}





