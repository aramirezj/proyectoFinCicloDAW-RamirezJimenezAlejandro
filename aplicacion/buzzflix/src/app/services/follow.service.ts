import { Injectable} from '@angular/core';
import { CONFIG } from './../config/config';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { RestService } from './rest.service';
@Injectable()
export class FollowService {
    constructor(
        private authService: AuthService,
        private restService: RestService
    ) {
    }

    isFollowing(id2: number): Observable<boolean> {
        let url = `${CONFIG.apiUrl}isFollowing`;
        let body = { origen: this.authService.getAuthUserId(), destino: id2 }
        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                observer.next(response.respuesta)
                observer.complete();
            })
        });
    }

    follow(id2: number): Observable<void> {
        let url = `${CONFIG.apiUrl}follow`;
        let body = { origen: this.authService.getAuthUserId(), destino: id2 }

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                observer.next()
                observer.complete();
            })
        });
    }

    unfollow(id2: number): Observable<void> {
        let url = `${CONFIG.apiUrl}unfollow`;
        let body = { origen: this.authService.getAuthUserId(), destino: id2 }

        return Observable.create(observer => {
            this.restService.peticionHttp(url, body).subscribe(response => {
                observer.next()
                observer.complete();
            })
        });
    }
}
