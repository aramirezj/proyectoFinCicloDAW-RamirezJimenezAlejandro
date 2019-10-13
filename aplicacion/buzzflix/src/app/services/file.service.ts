import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(
        private afStorage: AngularFireStorage
    ) {

    }

    obtenerUrl(fileName:string):Observable<any>{
        return this.afStorage.ref(fileName).getDownloadURL();
    }
    obtenerReferencia(fileName:string):AngularFireStorageReference{
        return this.afStorage.ref(fileName);
    }
    deleteImg(fileName:string):Observable<any>{
        return this.afStorage.ref(fileName).delete();
    }

    makeRandomName(extension: string): string {
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

    formatoValido(file: File): string {
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