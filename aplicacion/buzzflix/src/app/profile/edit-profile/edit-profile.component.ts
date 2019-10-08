import { Component, OnInit, Inject, ViewChild } from '@angular/core';
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
import { WINDOW } from '@ng-toolkit/universal';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
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
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @ViewChild(ImageCropperComponent, { static: false }) imageCropper: ImageCropperComponent;

  constructor(
    @Inject(WINDOW) private window: Window,
    private fileService: FileService,
    private authService: AuthService,
    private userService: UserService,
    private notifyService: NotifyService,
    private bar: NgProgress,
    private router: Router
  ) { }

  
  recortar() {
    Promise.resolve(this.imageCropper.crop()).then(resp => {
      this.imageCropped(resp, true);
    })
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent, origen?: boolean) {
    if (origen) {
      this.croppedImage = event.base64;
      let ext = event.file.type.split("/")[1];
      let rawFile = this.fileService.blobToFile(event.file, "avatar." + ext);
      this.file = this.fileService.prepareFile(rawFile);
      this.textInput = this.file != null ? this.file.name : "Sube aquí tu nuevo avatar.";
      if (this.file == null) {
        this.notifyService.notify("Los formatos aceptados son PNG,JPG,JPEG", "error");
        this.profileForm.get("avatar").reset();
      }
    }
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
  }
  loadImageFailed() {
    // show message
  }

  ngOnInit() {
    this.textInput = "Sube aquí tu nuevo avatar.";
    this.usuario = this.authService.getAuthUser();
    this.creaFormulario();
    this.loaded = true;
  }

  creaFormulario() {
    this.profileForm = new FormGroup({
      nombre: new FormControl(this.usuario.name, [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      nickname: new FormControl(this.usuario.nickname, [Validators.required,Validators.minLength(4), Validators.maxLength(15)]),
      oldPass: new FormControl(null, [Validators.minLength(6), Validators.maxLength(30)]),
      newPass: new FormControl(null, [Validators.minLength(6), Validators.maxLength(30)]),
      avatar: new FormControl(null, null)
    });
  }

  editProfile(): void {
    let datos: any = [];
    let cambios = false;
    if (this.authService.getAuthUser().name != this.profileForm.get("nombre").value) {
      datos["nombre"] = this.profileForm.get("nombre").value;
      cambios = true;
    }
    if (this.usuario.nickname != this.profileForm.get("nickname").value) {
      datos["nickname"] = this.profileForm.get("nickname").value;
      cambios = true;
    }
    if (this.profileForm.get("oldPass").value != null && this.profileForm.get("newPass").value != null) {
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
    if (this.profileForm.get('nickname').invalid) {
      cambios = false;
    }
    if (cambios) {
      this.bar.start();
      this.userService.updateProfile(datos)
        .subscribe((usuario) => {
          console.log(usuario)
         if(usuario!=null){
          this.usuario = usuario;
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

  checkUsed(): void {
    if (!this.profileForm.get('nickname').invalid && this.profileForm.get('nickname').value != this.usuario.nickname) {
      this.authService.checkNickname(this.profileForm.get('nickname').value)
        .subscribe((verdad) => {
          if (verdad) {
            this.profileForm.get('nickname').setErrors({ 'incorrect': verdad });
          } else {
            this.profileForm.get('nickname').setErrors(null);
          }
          this.profileForm.updateValueAndValidity();
        })
    }
  }
}
