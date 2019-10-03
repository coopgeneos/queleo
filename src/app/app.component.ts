import { Component } from '@angular/core';
import { FeedService } from './services/feed.service';

import { AngularFireDatabase } from '@angular/fire/database';

import { Noticia } from './models/noticia';
import { Md5 } from 'ts-md5/dist/md5';
import { Usuario } from './models/usuario';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

const md5 = new Md5();

const uuidv3 = require('uuid/v3');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  
  feedUrl: any[] = [];
  feedUrlBD: string[] = [];
  feedUrlKeys: string[] = [];
  
  rss: any;
  rssRef: any;
  catRef: any;
  notRef: any;
  userRef: any;

  nombreRSS: string;
  urlRSS: string;
  catRSS: any;

  cat: any;
  categorias: string[];

  arregloNotRef: any;
  noticias: Noticia[] = [];

  nombreUsuarioR: string;
  passwordUsuarioR: string;
  nombreUsuarioL: string;
  passwordUsuarioL: string;

  usuarios:Usuario;
  public session:Usuario;
  catFavUsuario:string[];
  
  constructor(
    private feedService: FeedService,
    public db: AngularFireDatabase, 
    public afAuth: AngularFireAuth,
    private router: Router) {
      this.rssRef = db.list('rss');
      this.catRef = db.list('categoria');
      this.notRef = db.list('noticias');
      // this.userRef = db.list('usuario');
  }

  logout(){
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/signin']);
    });
  }

  ngOnInit() {
    // this.tituloVisible=true;[];
    this.catRef.valueChanges().subscribe(data => {
      this.categorias = data;

    }
    );
    /*this.userRef.valueChanges().subscribe(data => {
      this.usuarios = data;

    }
    );*/
    //console.log('this.catRef.update',this.catRef.update("jahhasggas",{nombre:'pingo'}));

    this.notRef.valueChanges().subscribe(data => {
      this.arregloNotRef = data;

    }
    );

  }

  agregarRSS() {

    let indice = this.categorias.findIndex(elem => elem['nombre'] === this.catRSS);

    /* let key = this.categorias.findIndex(elem=>{
        return elem['nombre'] = this.catRSS
      }, this);
      console.log(key) */
    let valid = /^(ftp|http|https):\/\/[^ "]+$/.test(this.urlRSS);
    if (valid && (this.nombreRSS && indice)) {
      this.rssRef.push(

        {
          nombre: this.nombreRSS,
          url: this.urlRSS,
          aceptable: false,
          categoria: indice

        }
      );
    }
    else {

    }
  }

  guardarNoticias() {
    //let url = "http://wvw.nacion.com/rss/economia.xml";
    console.log(this.feedUrl['Nación - Economía'][0], this.feedUrl)
    console.log(this.noticias[1].link, this.arregloNotRef[0].link,this.noticias[1].link== this.arregloNotRef[0].link, "thisnotice")
    //console.log('this.catRef.update',this.catRef.update("1",{nombre:'Economíaaa'}));

    this.feedUrlKeys.forEach(element => {
      if (this.feedUrl[element][1] == true) {
        this.noticias.forEach(elem => {
          if (this.feedUrl[element][0] == elem.srcRSS) {
 
            let uuid = uuidv3(elem.link, uuidv3.DNS);
              this.notRef.update(uuid,{
                author: elem.author,
                description: elem.description,
                image: elem.image || '',
                link: elem.link,
                pubDate: elem.pubDate,
                srcRSS: elem.srcRSS,
                title: elem.title
              })
          }

        });

      }


      console.log(element, "rss individual")
    });


   
  }
  agregarFavoritos(data) {
    console.log(data.carpetas)
   // for(let c of data.carpetas)
    
  }
  agregarCarpetas(data){
    this.db.list('usuario/'+this.session.username+'/carpetasFav').push({
      nombre: data.nombre,
    })
    console.log(data)
  }
  registrarUsuario(){
    let existe:boolean;
    let nameUser = this.nombreUsuarioR;

    
      let user = this.db.object('usuario/'+nameUser).valueChanges()
      .subscribe(data =>{
        if(!data){
          //seguir registro
        }
        console.log("asc")
      })
      
    
  }
  loginUsuario(){
    let nameUser = this.nombreUsuarioL;
    
    let existe:boolean;
    let user:any = this.db.object('usuario/'+nameUser).valueChanges()
    .subscribe(data =>{
      user = data;
      console.log('user', user);
      if(user){
        if(user.password==md5.appendStr(this.passwordUsuarioL).end()){
          existe=true;
          console.log("existe")
        }
      }
      if(existe){
        let usuarionuevo:Usuario = new Usuario();
        usuarionuevo.username = user.username;
        usuarionuevo.password = user.password;
        usuarionuevo.favoritos = user.favoritos;
        usuarionuevo.carpetaFav = user.carpetasFav;
        this.session = usuarionuevo;
        console.log(this.session)

      }

    });

    //console.log(user)    
    
      
    
    
  }
  
}
