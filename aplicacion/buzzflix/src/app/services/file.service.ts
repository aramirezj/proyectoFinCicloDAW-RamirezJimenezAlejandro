import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config/config';
import { Router } from '@angular/router'
import { NgxImageCompressService } from 'ngx-image-compress';

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
        let formato = this.formatoValido(file)
        if (formato != null) {
            Object.defineProperty(file, "name", {
                value: this.makeRandomName(formato),
                writable: false
            })
            return file;
        } else {
            return null;
        }
    }

    formatoValido(file: File): String {
        let extension = file.type.split("/")[1].toUpperCase();
        if (extension === "JPG" || extension === "JPEG" || extension === "PNG") {
            return extension;
        } else {
            return null;
        }
    }

    public blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        b.lastModifiedDate = new Date();
        let file = <File>theBlob;
        Object.defineProperty(file, "name", {
            value: fileName,
            writable: false,
            configurable: true
        })
        return file;
    }











}