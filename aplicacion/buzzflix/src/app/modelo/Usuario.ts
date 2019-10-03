export class Usuario{
    id:number;
    name:string;
    nickname:string;
    avatar:string|any;
    constructor(id:number,name:string,nickname:string,avatar:string){
        this.id=id;
        this.name=name;
        this.nickname=nickname;
        this.avatar=avatar;
    }
    

}