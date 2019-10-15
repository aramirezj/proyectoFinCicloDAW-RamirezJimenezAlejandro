import { Component, OnInit } from '@angular/core';
import { AuthService as AuthWeb } from '../services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { socialLoginService } from '../services/socialLogin.service';
import { Socialusers } from '../modelo/SocialUsers'
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgetForm: FormGroup;
  matcher = new ErrorStateMatcher();
  confirmacion: string;
  response;
  socialusers = new Socialusers();
  subsRouter: Subscription;
  constructor(
    public OAuth: AuthService,
    private userService: UserService,
    private socialLoginService: socialLoginService,
    private authService: AuthWeb,
    private router2: Router,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subsRouter = this.router.params.subscribe((params) => {
      this.confirmacion = params['confirmacion'];
      this.gestionaPagina();
    })
  }
  ngOnDestroy(){
    this.subsRouter.unsubscribe();
  }

  gestionaPagina() {
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
          if (this.authService.logUserIn(user)) {
            this.userService.userProfileUpdated.emit(user);
            this.router2.navigate(['/ver/todos']);
          };
        });
    }
  }

  createForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
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
      .subscribe((user) => {
        if (this.authService.logUserIn(user)) {
          this.userService.userProfileUpdated.emit(user);
          this.router2.navigate(['/ver/todos']);
        };
      })
  }

  onSubmit(): void {
    if (!this.loginForm.invalid) {
      this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .subscribe((user) => {
          if (this.authService.logUserIn(user)) {
            this.userService.userProfileUpdated.emit(user);
            this.router2.navigate(['/ver/todos']);
          };
        })
    }
  }




}
