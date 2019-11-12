import {Injectable } from '@angular/core';
import { Router,CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        private authService:AuthService,
        private router:Router,
        private snackBar:MatSnackBar
    ){}
    canActivate(){
       if(this.authService.isLoggedIn()){
        return true;
       }else{
        this.snackBar.open('Debes iniciar sesión antes', "Cerrar", { duration: 4000, panelClass: 'snackBarWrong' });
        this.router.navigate(['/auth/login']);
        return false;
       }
    }
}