import { Component, OnInit } from '@angular/core';
import { AuthService as AuthWeb } from '../services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { socialLoginService } from '../services/socialLogin.service';
import { SocialLoginModule, AuthServiceConfig } from 'angular-6-social-login';
import { Socialusers } from '../modelo/SocialUsers'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgetForm: FormGroup;
  matcher = new ErrorStateMatcher();
  confirmacion: String;
  response;
  socialusers = new Socialusers();
  constructor(
    public OAuth: AuthService,
    private socialLoginService: socialLoginService,
    private authService: AuthWeb,
    private router: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.confirmacion = params['confirmacion'];
    })

    switch (this.confirmacion) {
      case undefined:
        this.createForm();
        break;
      case "waiting":
        this.createForm();
        break;
      default:
        this.createForm();
        this.authService.confirmaEmail(this.confirmacion).subscribe((user) => {
          this.authService.logUserIn(user);
        });
    }
  }

  createForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onSubmit(): void {
    if (!this.loginForm.invalid) {
      this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .subscribe((user) => {
          this.authService.logUserIn(user);
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
        console.log(resp)
        this.authService.logUserIn(resp);
      })
  }


}
