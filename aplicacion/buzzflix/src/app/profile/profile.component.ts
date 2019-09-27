import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { Usuario } from '../modelo/Usuario';
import { AuthService } from '../services/auth.service';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { LogrosComponent } from './logros/logros.component';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { WINDOW } from '@ng-toolkit/universal';
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
  logros: number;
  cantidad: number
  downloadURL: any
  mutual: any
  mutualaux: boolean
  showEditar: boolean=true; //Para gestionar el cambio de boton
  showLogros:boolean=true;
  showWall:boolean=false;
  @ViewChild(LogrosComponent,{static: false}) child;
  constructor(@Inject(WINDOW) private window: Window, 
    private router: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    public dialog: MatDialog
  ) {
    this.userService.userProfileUpdated.subscribe((usuario) => {
      this.usuario = usuario;
      if (this.usuario.avatar == "" || this.usuario.avatar == null) {
        this.usuario.avatar = this.afStorage.ref("hehexd.PNG").getDownloadURL();
      } else if (typeof this.usuario.avatar == "string") {
        this.usuario.avatar = this.afStorage.ref(this.usuario.avatar).getDownloadURL();
      }
      this.cargaStats();
    })
  }

  isAuthUserProfile(): boolean {
    return +this.id === +this.authService.getAuthUserId();
  }

  gestionaPosicion(){
    this.showLogros =  window.location.href.indexOf("logros") == -1 ? true : false;
    this.showEditar =  window.location.href.indexOf("edit") == -1 ? true : false;
    if(window.location.href.indexOf("logros") != -1 || window.location.href.indexOf("edit") != -1){
      this.showWall=true;
    }
  }

  ngOnInit() {
    this.gestionaPosicion();
    
    this.router.params.subscribe((params) => {
      this.id = +params['id'];
      this.userService.changeMessage(this.id);
      this.userService.getUserById(this.id)
        .subscribe((usuario) => {
          this.usuario = usuario;
          if (this.usuario.avatar == "" || this.usuario.avatar == null) {
            this.usuario.avatar = "hehexd.PNG";
          }
          this.usuario.avatar = this.afStorage.ref(this.usuario.avatar).getDownloadURL();
          this.cargaStats();
        })
    })
  }
  //Función que cargará la cantidad de seguidores,seguidos y logros obtenidos.
  cargaStats() {
    this.userService.getUserStats(this.id)
      .subscribe((resp) => {
        this.follows = resp["seguidos"];
        this.followers = resp["seguidores"];
        this.logros = resp["logros"];
        this.mutual = resp["mutual"];
        this.cantidad = resp["cantidad"];
        //this.mutualaux = this.mutual.length == 2 ? true : false;
      })
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

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {

    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: 1,
      title: 'Si crees que este perfil incluye contenido abusivo o imagenes que incitan al odio, puedes reportarlo y será investigado.'
    };

    const dialogRef = this.dialog.open(DialogboxComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => this.reportar(data)

    );
  }

  reportar(accion){
    if(accion){
      this.userService.reportarUsuario(this.id).subscribe();
    }
  }
}




