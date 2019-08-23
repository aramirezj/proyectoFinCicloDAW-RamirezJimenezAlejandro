import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NotifyService } from './notify.service';
import { CONFIG } from './../config/config';
import { AuthService } from './auth.service';
import { NgProgressService } from 'ng2-progressbar';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
@Injectable()
export class FollowService {
    private headers: HttpHeaders
    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private bar: NgProgressService,
        private notifyService: NotifyService
    ) {
        this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
    }
    getToken(): string {
        return localStorage.getItem('token');
    }

    isFollowing(id2: number): Observable<boolean> {
        let url = `${CONFIG.apiUrl}is/following`;
        let body = { origen: this.authService.getAuthUserId(), destino: id2 }
        return this.http.post(url, body, { observe: 'body', headers: this.headers })
            .map((response: boolean) => {
                return response;
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }

    follow(id2: number): Observable<void> {
        this.bar.start();
        let url = `${CONFIG.apiUrl}follow`;
        let body = { origen: this.authService.getAuthUserId(), destino: id2 }
        return this.http.post(url, body, { observe: 'body', headers: this.headers })
            .map((response: any) => {
                this.bar.done();
                if (response.status == "200") {
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Hubo un error con el servidor.", "error");
                } else if (response.status = "No tienes permiso") {
                    this.notifyService.notify("No tienes permiso.", "error");
                }
                else if (response.status == "Token Invalido") {
                    this.notifyService.notify("Token invalido.", "error");
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });

    }

    unfollow(id2: number): Observable<void> {
        this.bar.start();
        let url = `${CONFIG.apiUrl}unfollow`;
        let body = { origen: this.authService.getAuthUserId(), destino: id2 }
        return this.http.post(url, body, { observe: 'body', headers: this.headers })
            .map((response: any) => {
                this.bar.done();
                if (response.status == "200") {
                } else if (response.status == "Error sql") {
                    this.notifyService.notify("Hubo un error con el servidor.", "error");
                } else if (response.status = "No tienes permiso") {
                    this.notifyService.notify("No tienes permiso.", "error");
                }
                else if (response.status == "Token Invalido") {
                    this.notifyService.notify("Token invalido.", "error");
                }
            }, (err: HttpErrorResponse) => {
                console.log(err);
            });
    }
}
