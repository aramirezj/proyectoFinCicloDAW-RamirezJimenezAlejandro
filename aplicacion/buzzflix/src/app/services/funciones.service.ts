import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class FuncionesService {
    private headers: HttpHeaders
    constructor(
        private http: HttpClient
    ) {
        this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
    }
    getToken(): string {
        return localStorage.getItem('token');
    }

    peticionGet(url: string): Observable<any> {
        return this.http.get(url, { observe: 'body', headers: this.headers })
            .map((response: any) => {
                return response;
            }, (err: HttpErrorResponse) => {
                console.log(err);
            })
    }
    peticionPost(url: string,body:Object): Observable<any> {
        return this.http.post(url,body, { observe: 'body', headers: this.headers })
            .map((response: any) => {
                return response;
            }, (err: HttpErrorResponse) => {
                console.log(err);
            })
    }



}