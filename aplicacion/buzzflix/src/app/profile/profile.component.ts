import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Usuario } from '../modelo/Usuario';
import { AuthService } from '../services/auth.service';
import { Http } from '@angular/http';
import { QuizzService } from '../services/quizz.service';
import * as $ from 'jquery';
import { AngularFireStorage } from 'angularfire2/storage';
import { NgProgressService } from 'ng2-progressbar';
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
  downloadURL:any
  mutual:any
  mutualaux:boolean
  constructor(
    private router: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private quizzService:QuizzService,
    private afStorage: AngularFireStorage,
    private bar: NgProgressService
  ) {
    
    this.userService.userProfileUpdated.subscribe((usuario) => {
      this.usuario = usuario;
      this.bar.done();
      if(this.usuario.avatar!='assets/img/hehexd.png"' && this.usuario.avatar!= null){
        this.usuario.avatar = this.afStorage.ref(this.usuario.avatar).getDownloadURL();
      }
      //this.usuario.avatar = this.afStorage.ref(this.usuario.avatar).getDownloadURL();
    })
  }

  isAuthUserProfile(): boolean {
    return +this.id === +this.authService.getAuthUserId();
  }


  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.id = +params['id'];
      this.userService.getUserById(this.id)
        .then((usuario) => { 
          this.usuario = usuario;
          if(this.usuario.avatar==null || this.usuario.avatar =="" || this.usuario.avatar =="null"){
            this.usuario.avatar="hehexd.PNG";
          }
            this.usuario.avatar = this.afStorage.ref(this.usuario.avatar).getDownloadURL();
          this.cargaFollows();
          this.cargaCantidad();
         })
    })
  }

  

  cargaFollows(){
    this.userService.getUserFollowers(this.id)
      .then((resp) => {
        this.follows = resp[1];
        this.followers = resp[2];
        this.mutual = resp[0];
        if(this.mutual.length==2){
          this.mutualaux = true;
        }
      })
  }

  cargaCantidad(){
    this.quizzService.getCantidad(this.id)
      .then((resp)=>{
        this.cantidad=resp;
      });
  }

  onNotify(n:number):void {
    if(n==-1){
      this.followers--;
      this.mutualaux=false;
    }else{
      this.followers++;
      if(this.mutual[0].origen==this.id){
        this.mutualaux=true;
      }
    }
  }

  



}




