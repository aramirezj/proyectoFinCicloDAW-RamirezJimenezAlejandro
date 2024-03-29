import {Injectable } from '@angular/core';
import { Router,CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable()
export class AuthedGuard implements CanActivate{
    constructor(
        private authService:AuthService,
        private router:Router
    ){}
    canActivate(){
       if(!this.authService.isLoggedIn()){
        return true;
       }
        this.router.navigate(['/ver/todos']);
        return false;
       
    }
}