import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config/config';
import { Router } from '@angular/router'
import {NgxImageCompressService} from 'ngx-image-compress';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(
        private imageCompress: NgxImageCompressService
    ) {

    }

    makeRandomName(extension: String): String {
        let name = Math.random().toString(36).substring(2) + "." + extension;
        return name;
    }


    prepareFile(file: File) {
     
        let extension = file.name.split(".")[1].toUpperCase();
        if (extension === "JPG" || extension === "JPEG" || extension === "PNG") {
            Object.defineProperty(file, "name", {
                value: this.makeRandomName(extension),
                writable: false
            })
            return file;
        } else {
            return null;
        }
    }











}