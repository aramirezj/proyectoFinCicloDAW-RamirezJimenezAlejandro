import { Component, OnInit } from '@angular/core';
import { AuthService as AuthWeb } from '../services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { AuthService, GoogleLoginProvider } from "angularx-social-login";
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  matcher = new ErrorStateMatcher();
  constructor(
    private authService: AuthService,
    private authWeb:AuthWeb
  ) { }

  ngOnInit() {
    this.createForm();
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  createForm() {
    this.registroForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email,Validators.maxLength(50)]),
      nombre: new FormControl(null, [Validators.required, Validators.minLength(2),Validators.maxLength(20)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6),Validators.maxLength(30)]),
      password2: new FormControl(null, [Validators.required, Validators.minLength(6),Validators.maxLength(30)])
    });
  }
  onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  onSubmit() {
    if (!this.registroForm.invalid) {
      this.authWeb.register(this.registroForm.get('nombre').value, this.registroForm.get('email').value, this.registroForm.get('password').value)
        .subscribe((verdad) => {
        })
    }
  }





















}





