import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { RestService } from './rest.service';
import { SocialUser } from 'angular-6-social-login';
import { CONFIG } from '../config/config';
import { Observable } from 'rxjs';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../modelo/Usuario';

@Injectable({
    providedIn: 'root'
})
export class socialLoginService {
    url: string;
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private restService: RestService,
    ) {

    }



    loginSocial(usuario: SocialUser): Observable<Usuario> {
        let body = { id: usuario.id, email: usuario.email, nombre: usuario.name, origen: usuario.provider };
        let url = `${CONFIG.apiUrl}socialLogin`;

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                if (response.auth) {
                    let usuarioWeb: Usuario;
                    usuarioWeb = response.respuesta == null ? new Usuario(response.id, usuario.name, null, "") : response.respuesta;

                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem("token", response.token);

                    }
                    observer.next(usuarioWeb)
                    observer.complete();
                } else {
                    observer.next(null)
                    observer.complete();
                }
            })
        });
    }

    

}
