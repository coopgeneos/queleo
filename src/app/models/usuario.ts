export class Usuario {
    username:string;
    password:string;
    favoritos:any;
    //historico:any;
    carpetaFav:any;
    constructor(){
        this.username="";
        this.password="";
        this.favoritos=[];
        this.carpetaFav=[];
    }
}
