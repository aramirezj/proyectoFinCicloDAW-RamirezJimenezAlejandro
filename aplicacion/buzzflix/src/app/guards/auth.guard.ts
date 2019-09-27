import {Injectable } from '@angular/core';
import { Router,CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotifyService } from '../services/notify.service';
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private authService:AuthService,
        private router:Router,
        private notifyService: NotifyService
    ){}
    canActivate(){
       if(this.authService.isLoggedIn()){
        return true;
       }else{
        this.notifyService.notify("Debes iniciar sesión antes","error");
        this.router.navigate(['/auth/login']);
        return false;
       }
    }
}