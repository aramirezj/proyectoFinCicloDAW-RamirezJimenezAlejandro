import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-login2',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailFC = new FormControl('', [
    Validators.required,
    Validators.email,
  ])
  passFC = new FormControl('', [
    Validators.required
  ])
  matcher = new MyErrorStateMatcher();
  constructor(
    private authService: AuthService,
    private notifyService: NotifyService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    let verdad = true;
    if (this.emailFC.invalid) {
      this.notifyService.notify("El correo es obligatorio", "error");
      verdad = false;
    } else if (this.passFC.invalid) {
      this.notifyService.notify("La contraseña es obligatoria", "error");
      verdad = false;
    }
    if (verdad) {
      this.authService.login(this.emailFC.value, this.passFC.value)
        .subscribe((user) => {
          this.authService.logUserIn(user);
        })
    }

  }

}
