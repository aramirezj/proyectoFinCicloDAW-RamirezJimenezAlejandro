import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config/config';
import { Router } from '@angular/router'
import { NotifyService } from './notify.service';
import { RestService } from './rest.service';


@Injectable()
export class ImageService {
    constructor(
        private router: Router,
        private notifyService: NotifyService,
        private restService: RestService,
    ) {

    }

    public uploadImage(image: File): Observable<any> {
        let url = `${CONFIG.apiUrl}upload/user`;
        return Observable.create(observer => {
            return this.getBase64(image).subscribe(resp => {
                let body = { image: resp }
                Observable.create(observer => {
                    this.restService.peticionHttp(url, body).subscribe(response => {
                        console.log("·????")
                        observer.next(true);
                        observer.complete();
                    })
                }).subscribe();
            })
            observer.next(true);
            observer.complete();
        });

    }

    getBase64(file): Observable<String> {
        var reader = new FileReader();
        reader.readAsDataURL(file);


        return Observable.create(observer => {
            reader.onload = function () {
                console.log(reader.result);
                observer.next(reader.result);
                observer.complete();
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };

        });
    }
}
