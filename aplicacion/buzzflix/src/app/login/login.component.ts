import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  matcher = new ErrorStateMatcher();
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createForm();
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
