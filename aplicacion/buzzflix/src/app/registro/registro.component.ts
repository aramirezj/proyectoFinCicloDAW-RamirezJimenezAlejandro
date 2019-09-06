import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  matcher = new ErrorStateMatcher();
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.registroForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email,Validators.maxLength(50)]),
      nombre: new FormControl(null, [Validators.required, Validators.minLength(2),Validators.maxLength(20)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6),Validators.maxLength(30)]),
      password2: new FormControl(null, [Validators.required, Validators.minLength(6),Validators.maxLength(30)])
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





