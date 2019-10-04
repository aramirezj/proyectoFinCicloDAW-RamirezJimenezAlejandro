import { Component, OnInit } from '@angular/core';
import { AuthService as AuthWeb } from '../services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { socialLoginService } from '../services/socialLogin.service';
import { Socialusers } from '../modelo/SocialUsers';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;
  matcher = new ErrorStateMatcher();
  nickPillado: boolean = false;
  response;
  socialusers = new Socialusers();
  constructor(
    private authWeb: AuthWeb,
    public OAuth: AuthService,
    private socialLoginService: socialLoginService
  ) { }

  ngOnInit() {
    this.createForm();
  }


  createForm() {
    this.registroForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(50)]),
      nombre: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      nickname: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
      password2: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)])
    });
  }

  checkUsed(): void {
    if (!this.registroForm.get('nickname').invalid) {
      this.authWeb.checkNickname(this.registroForm.get('nickname').value)
        .subscribe((verdad) => {
          if (verdad) {
            this.registroForm.get('nickname').setErrors({ 'incorrect': verdad });
          } else {
            this.registroForm.get('nickname').setErrors(null);
          }
          this.registroForm.updateValueAndValidity();
        })
    }
  }


  onSubmit() {
    if (!this.registroForm.invalid) {
      this.authWeb.register(this.registroForm.get('nombre').value, this.registroForm.get('nickname').value, this.registroForm.get('email').value, this.registroForm.get('password').value)
        .subscribe((verdad) => {
        })
    }
  }

  public loginSocial(socialProvider: string): void {
    let socialPlatformProvider;
    if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.OAuth.signIn(socialPlatformProvider).then(socialusers => {
      this.respuestaSocial(socialusers);
    });
  }

  respuestaSocial(socialusers: Socialusers): void {
    this.socialLoginService.loginSocial(socialusers)
      .subscribe((resp) => {
        this.authWeb.logUserIn(resp);
      })
  }




}





