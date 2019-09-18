import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelo/Usuario';
import { AuthService } from './../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotifyService } from 'src/app/services/notify.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import * as $ from 'jquery';
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
    private authService: AuthService,
    private userService: UserService,
    private notifyService: NotifyService,
    private bar: NgProgress,

  ) {
    this.textInput = "Sube aquí tu nuevo avatar.";
    this.creaFormulario();


  }

  ngOnInit() {
    this.usuario = this.authService.getAuthUser();
    $('html,body').animate({scrollTop: document.body.scrollHeight},"medium");
  }

  creaFormulario() {
    this.profileForm = new FormGroup({
      nombre: new FormControl(null, [Validators.required, Validators.minLength(2),Validators.maxLength(20)]),
      oldPass: new FormControl(null, [Validators.minLength(6),Validators.maxLength(30)]),
      newPass: new FormControl(null, [Validators.minLength(6),Validators.maxLength(30)]),
      avatar: new FormControl(null,null)
    });
  }

  editProfile() {
    let datos: any = [];
    let cambios = false;
    if (this.authService.getAuthUser().name != this.profileForm.get("nombre").value) {
      datos["nombre"] = this.profileForm.get("nombre").value;
      cambios = true;
    }
    if (this.profileForm.get("oldPass").value != "" && this.profileForm.get("newPass").value != "") {
      datos["oldpass"] = this.profileForm.get("oldPass").value;
      datos["newpass"] = this.profileForm.get("newPass").value;
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
        .subscribe((usuario) => {
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
      this.profileForm.get("avatar").reset();
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
