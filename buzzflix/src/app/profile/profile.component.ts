import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Usuario } from '../modelo/usuario';
import { AuthService } from '../services/auth.service';
import { Http } from '@angular/http';
import { QuizzService } from '../services/quizz.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  id: number
  usuario: Usuario
  followers: number
  follows: number
  cantidad:number
  constructor(
    private router: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private quizzService:QuizzService
  ) {
    this.userService.userProfileUpdated.subscribe((usuario) => {
      this.usuario = usuario;
    })
  }

  isAuthUserProfile(): boolean {
    return +this.id === +this.authService.getAuthUserId();
  }


  ngOnInit() {
    console.log("??")
    this.router.params.subscribe((params) => {
      this.id = +params['id'];
      this.userService.getUserById(this.id)
        .then((usuario) => { 
          this.usuario = usuario;
          if(this.usuario.avatar==null || this.usuario.avatar ==""){
            this.usuario.avatar="hehexd.png";
          }
          this.cargaFollows();
          this.cargaCantidad();
         })
    })
  }

  

  cargaFollows(){
    this.userService.getUserFollowers(this.id)
      .then((resp) => {
        this.follows = resp[0];
        this.followers = resp[1];
      })
  }

  cargaCantidad(){
    this.quizzService.getCantidad(this.id)
      .then((resp)=>{
        this.cantidad=resp;
        console.log("la cantidad es "+this.cantidad)
      });
  }

  onNotify(n:number):void {
    if(n==-1){
      this.followers--;
    }else{
      this.followers++;
    }
  }

  



}
