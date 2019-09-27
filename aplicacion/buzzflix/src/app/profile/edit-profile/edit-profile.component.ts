import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelo/Usuario';
import { AuthService } from './../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NotifyService } from 'src/app/services/notify.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgProgress } from 'ngx-progressbar';
import * as $ from 'jquery';
import { FileService } from 'src/app/services/file.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  usuario: Usuario;
  file: File;
  profileForm: FormGroup;
  textInput: String;
  loaded: boolean = false;

  constructor(
    private fileService: FileService,
    private authService: AuthService,
    private userService: UserService,
    private notifyService: NotifyService,
    private bar: NgProgress,
    private router: Router
  ) { }

  ngOnInit() {
    this.textInput = "Sube aquí tu nuevo avatar.";
    this.usuario = this.authService.getAuthUser();
    this.creaFormulario();
    this.loaded = true;
  }

  creaFormulario() {
    this.profileForm = new FormGroup({
      nombre: new FormControl(this.usuario.name, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      oldPass: new FormControl(null, [Validators.minLength(6), Validators.maxLength(30)]),
      newPass: new FormControl(null, [Validators.minLength(6), Validators.maxLength(30)]),
      avatar: new FormControl(null, null)
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
          this.bar.done();
          if (usuario != null) {
            this.usuario = usuario;
          } else {
            this.usuario.avatar = "";
          }
        })
    }
  }

  onFileChange(event) {
    const [rawFile] = event.target.files;
    this.file = this.fileService.prepareFile(rawFile);
    this.textInput = this.file != null ? this.file.name : "Sube aquí tu nuevo avatar.";
    if (this.file == null) {
      this.notifyService.notify("Los formatos aceptados son PNG,JPG,JPEG", "error");
      this.profileForm.get("avatar").reset();
    }
  }
}
