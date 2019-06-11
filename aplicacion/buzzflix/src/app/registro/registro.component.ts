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
  form: FormGroup;
  nombreFC = new FormControl('',[
    Validators.required,
    Validators.minLength(3)
  ])
  emailFC = new FormControl('', [
    Validators.required,
    Validators.email,
  ])
  passFC = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ])
  
  matcher = new MyErrorStateMatcher();

  constructor(
    private authService:AuthService,
    private fb: FormBuilder,
    private notifyService:NotifyService
    ) { }

  ngOnInit() {
    this.form = this.fb.group({
      
    })
  }

  onSubmit(form){
    console.log("llego a onsubmit");
    let verdad=true;
    if(this.nombreFC.invalid){
      this.notifyService.notify("El nombre es obligatorio","error");
      verdad=false;
    }else if(this.emailFC.invalid){
      this.notifyService.notify("El correo no es valido","error");
      verdad=false;
    }else if( this.passFC.invalid){
      this.notifyService.notify("La contraseña no es valida","error");
      verdad=false;
    }
    if(verdad){
      this.authService.register(this.nombreFC.value,this.emailFC.value,this.passFC.value)
    .then((usuario)=>{
      if(usuario!=null){
        this.authService.logUserIn(usuario);
      }
      
    })
    }
  
  }












  








}





