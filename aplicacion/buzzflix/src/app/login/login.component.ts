import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgetForm: FormGroup;
  matcher = new ErrorStateMatcher();
  confirmacion: String
  constructor(
    private authService: AuthService,
    private router: ActivatedRoute
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

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    if (!this.loginForm.invalid) {
      this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .subscribe((user) => {
          this.authService.logUserIn(user);
        })
    }
  }
}
