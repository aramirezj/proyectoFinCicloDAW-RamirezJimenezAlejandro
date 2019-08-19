import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Usuario } from '../modelo/Usuario';
import { AuthService } from '../services/auth.service';
import { QuizzService } from '../services/quizz.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { LogrosComponent } from './logros/logros.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  id: number
  usuario: Usuario
  followers: number;
  follows: number;
  logros:number;
  cantidad: number
  downloadURL: any
  mutual: any
  mutualaux: boolean
  @ViewChild(LogrosComponent) child;
  constructor(
    private router: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private quizzService: QuizzService,
    private afStorage: AngularFireStorage,
  ) {

    this.userService.userProfileUpdated.subscribe((usuario) => {
      this.usuario = usuario;
      if (this.usuario.avatar == "" || this.usuario.avatar == null) {
        this.usuario.avatar = this.afStorage.ref("hehexd.PNG").getDownloadURL();
      } else if (this.usuario.avatar != null) {
        this.usuario.avatar = this.afStorage.ref(this.usuario.avatar).getDownloadURL();
      }
    })
  }

  isAuthUserProfile(): boolean {
    return +this.id === +this.authService.getAuthUserId();
  }


  ngOnInit() {
    this.router.params.subscribe((params) => {
      this.id = +params['id'];
      this.userService.changeMessage(this.id);
      this.userService.getUserById(this.id)
        .then((usuario) => {
          this.usuario = usuario;
          if (this.usuario.avatar == "" || this.usuario.avatar == null) {
            this.usuario.avatar = "hehexd.PNG";
          }
          this.usuario.avatar = this.afStorage.ref(this.usuario.avatar).getDownloadURL();
          this.cargaStats();
          this.cargaCantidad();
        })
    })
  }
  //Función que cargará la cantidad de seguidores,seguidos y logros obtenidos.
  cargaStats() {
    this.userService.getUserStats(this.id)
      .then((resp) => {
        this.follows = resp[1];
        this.followers = resp[2];
        this.logros=resp[3];
        this.mutual = resp[0];
        if (this.mutual.length == 2) {
          this.mutualaux = true;
        }
      })
  }

  cargaCantidad() {
    this.quizzService.getCantidad(this.id)
      .then((resp) => {
        this.cantidad = resp;
      });
  }

  onNotify(n: number): void {
    if (n == -1) {
      this.followers--;
      this.mutualaux = false;
    } else {
      this.followers++;
      if (this.mutual[0] != null) {
        if (this.mutual[0].origen == this.id) {
          this.mutualaux = true;
        }
      }

    }
  }





}




