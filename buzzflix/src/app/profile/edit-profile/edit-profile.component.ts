import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelo/Usuario';
import {AuthService } from './../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import * as $ from 'jquery';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  usuario:Usuario
  file:File
  emailFC = new FormControl('', [
    Validators.required,
    Validators.email,
  ])
  nombreFC = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  constructor(
    private authService:AuthService,
    private userService:UserService,
    private notifyService:NotifyService
  ) { }

  ngOnInit() {
    this.usuario=this.authService.getAuthUser();
  }

  editProfile(form){
    let aux:Usuario;
    if(this.file==null){
     aux = new Usuario(this.usuario.id,this.usuario.name,this.usuario.email,null);
    }else{
      aux = new Usuario(this.usuario.id,this.usuario.name,this.usuario.email,this.file.name);
    }
    this.userService.updateProfile(this.usuario,this.file)
    .then((usuario)=>{
      console.log(usuario);
      if(usuario!=null){
        if(usuario.avatar==null || usuario.avatar==""){
          usuario.avatar="hehexd.png";
        }
        this.usuario=usuario;
       
      }else{
        console.log("mando error")
        this.notifyService.notify("Ha ocurrido un error","danger");
      }
    })
  }


  onFileChanged(event) {
    const file = event.target.files[0];
    let formato = file.name.split(".")[1];
    Object.defineProperty(file,"name",{
      value:this.makeId(8)+"."+formato,
      writable:false
    })
    this.file = file;
    console.log(this.file)
  }

  makeId(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }



}


$(document).on('change', '.up', function () {
  var names: any = [];
  var length = $(this).get(0).files.length;
  for (var i = 0; i < $(this).get(0).files.length; ++i) {
    names.push($(this).get(0).files[i].name);
  }
  // $("input[name=file]").val(names);
  if (length > 2) {
    var fileName = names.join(', ');
    $(this).closest('.form-group').find('.form-control').attr("value", length + " files selected");
  }
  else {
    $(this).closest('.form-group').find('.form-control').attr("value", names);
  }
});
