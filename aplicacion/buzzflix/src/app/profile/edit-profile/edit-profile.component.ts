import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelo/Usuario';
import { AuthService } from './../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { NgProgressService } from 'ng2-progressbar';
import * as $ from 'jquery';
import { AngularFireStorage } from 'angularfire2/storage';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  usuario: Usuario
  file: File
  nombreFC = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  oldPassFC = new FormControl('', [
    Validators.minLength(6)
  ])
  newPassFC = new FormControl('', [
    Validators.minLength(6)
  ])
  textInput: String
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notifyService: NotifyService,
    private bar: NgProgressService,
    private afStorage: AngularFireStorage

  ) {
    this.textInput = "Sube aquí tu nuevo avatar.";
  }

  ngOnInit() {
    this.usuario = this.authService.getAuthUser();
    $('html,body').animate({scrollTop: document.body.scrollHeight},"medium");
  }

  editProfile(form) {
    let datos: any = [];
    let cambios=false;
    if (this.authService.getAuthUser().name != this.nombreFC.value) {
      datos["nombre"] = this.nombreFC.value;
      cambios=true;
    }
    if (this.oldPassFC.value != "" && this.newPassFC.value != "") {
      datos["oldpass"] = this.oldPassFC.value;
      datos["newpass"] = this.newPassFC.value;
      cambios=true;
    }
    if (this.file != null || this.file != undefined) {
      datos["file"] = this.file;
      cambios=true;
      if (this.usuario.avatar != null || this.usuario.avatar != undefined) {
        datos["oldfile"] = this.usuario.avatar;
      }
    }

    
    if (cambios) {
      this.bar.start();
      this.userService.updateProfile(datos)
        .then((usuario) => {
          if (usuario != null) {
            this.usuario = usuario;
          }else{
            this.usuario.avatar="";
          }
          this.bar.done();
        })
    }
    $('html,body').animate({scrollBottom: document.body.scrollHeight},"medium");
  }


  onFileChanged(event) {
    const file = event.target.files[0];
    this.textInput = file.name;
    let randomId = Math.random().toString(36).substring(2);
    let ext = file.name.split(".")[1];
    randomId = randomId + "." + ext;
    Object.defineProperty(file, "name", {
      value: randomId,
      writable: false
    })
    this.file = file;

  }
}


$(document).on('change', '.up', function () {
  var names: any = [];
  var length = $(this).get(0).files.length;
  for (var i = 0; i < $(this).get(0).files.length; ++i) {
    names.push($(this).get(0).files[i].name);
  }
  if (length > 2) {
    var fileName = names.join(', ');
    $(this).closest('.form-group').find('.form-control').attr("value", length + " files selected");
  }
  else {
    $(this).closest('.form-group').find('.form-control').attr("value", names);
  }
});
