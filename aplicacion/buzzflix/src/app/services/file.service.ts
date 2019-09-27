import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CONFIG } from '../config/config';
import { Router } from '@angular/router'
import { NgxImageCompressService } from 'ngx-image-compress';




@Injectable({
    providedIn: 'root'
})
export class FileService {
    private imgResultBeforeCompress: String;
    private imgResultAfterCompress: String;
    private fileList: String[] = new Array<String>();
    private fileList$: Subject<String[]> = new Subject<String[]>();
    constructor(
        private imageCompress: NgxImageCompressService
    ) {

    }

    compressFile() {
        this.imageCompress.uploadFile().then(({ image, orientation }) => {
            this.imgResultBeforeCompress = image;
            console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
            this.imageCompress.compressFile(image, orientation, 50, 50).then(
                result => {
                    this.imgResultAfterCompress = result;
                    console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
                }
            );

        });
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

    upload(fileName: string, fileContent: string): void {
        this.fileList.push(fileName);
        this.fileList$.next(this.fileList);
    }

    download(fileName: string): void {

    }

    remove(fileName): void {
        this.fileList.splice(this.fileList.findIndex(name => name === fileName), 1);
        this.fileList$.next(this.fileList);
    }

    list(): Observable<String[]> {
        return this.fileList$;
    }

    addFileToList(fileName: string): void {
        this.fileList.push(fileName);
        this.fileList$.next(this.fileList);
    }

}