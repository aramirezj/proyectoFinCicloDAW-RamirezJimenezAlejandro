export class Usuario{
    id:number;
    name:string;
    email:string;
    avatar:string|any;
    constructor(id:number,name:string,email:string,avatar:string){
        this.id=id;
        this.name=name;
        this.email=email;
        this.avatar=avatar;
    }
    

}