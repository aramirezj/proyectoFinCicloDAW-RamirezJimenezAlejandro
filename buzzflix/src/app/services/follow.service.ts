import { Injectable, ɵConsole } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NotifyService } from './notify.service';
import { CONFIG } from './../config/config';
import { AuthService } from './auth.service';
import { NgProgressService } from 'ng2-progressbar';
@Injectable()
export class FollowService{
    private headers:Headers
    constructor(
        private http:Http,
        private noty: NotifyService,
        private authService:AuthService,
        private bar:NgProgressService
    ){
        //this.headers=new Headers({});
    }

    isFollowing(id2:number):Promise<boolean>{
        let url = `${CONFIG.apiUrl}is/following`;
        let body = {origen:this.authService.getAuthUserId(),destino:id2}
        let options = new RequestOptions();
        return this.http.post(url,body,options)
        .toPromise()
        .then(response=>{
            return response.json().verdad;
        })
    }

    follow(id2:number){
        this.bar.start();
        let url = `${CONFIG.apiUrl}follow`;
        let body = {origen:this.authService.getAuthUserId(),destino:id2}
        let options = new RequestOptions();
        return this.http.post(url,body,options)
        .toPromise()
        .then(response=>{
            this.bar.done();
            return response.json();
        })
    }

    unfollow(id2:number){
        this.bar.start();
        let url = `${CONFIG.apiUrl}unfollow`;
        let body = {origen:this.authService.getAuthUserId(),destino:id2}
        let options = new RequestOptions();
        return this.http.post(url,body,options)
        .toPromise()
        .then(response=>{
            this.bar.done();
            return response.json();
        })
    }
}