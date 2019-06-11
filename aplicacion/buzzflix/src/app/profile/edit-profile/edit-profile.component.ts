import { Component, OnInit, createPlatformFactory } from '@angular/core';
import { Usuario } from 'src/app/modelo/Usuario';
import { AuthService } from './../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
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
  profileForm: FormGroup
  textInput: String
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private notifyService: NotifyService,
    private bar: NgProgressService,
    private afStorage: AngularFireStorage

  ) {
    this.textInput = "Sube aquí tu nuevo avatar.";
    this.creaFormulario();


  }

  ngOnInit() {
    this.usuario = this.authService.getAuthUser();
    $('html,body').animate({scrollTop: document.body.scrollHeight},"medium");
  }

  creaFormulario() {
    this.profileForm = this.fb.group({
      nombreFC: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      oldPassFC: ['', [
        Validators.minLength(6)
      ]],
      newPassFC: ['', [
        Validators.minLength(6)
      ]],
      avatar: ['', []]
    })
    console.log(this.profileForm)
  }

  editProfile(form) {
    let datos: any = [];
    let cambios = false;
    if (this.authService.getAuthUser().name != this.profileForm.get("nombreFC").value) {
      datos["nombre"] = this.profileForm.get("nombreFC").value;
      cambios = true;
    }
    if (this.profileForm.get("(oldPassFC").value != "" && this.profileForm.get("newPassFC").value != "") {
      datos["oldpass"] = this.profileForm.get("oldPassFC").value;
      datos["newpass"] = this.profileForm.get("newPassFC").value;
      cambios = true;
    }
    if (this.file != null || this.file != undefined) {
      datos["file"] = this.file;
      cambios = true;
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
          } else {
            this.usuario.avatar = "";
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
    let aux = ext.toUpperCase();
    if (aux === "JPG" || aux === "JPEG" || aux === "PNG") {
      randomId = randomId + "." + ext;
      Object.defineProperty(file, "name", {
        value: randomId,
        writable: false
      })
      this.file = file;
    } else {
      this.notifyService.notify("Los formatos aceptados son PNG,JPG,JPEG", "error");
      console.log(this.profileForm.get("avatar").reset());
      console.log(this.profileForm.get("avatar"))
    }
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
