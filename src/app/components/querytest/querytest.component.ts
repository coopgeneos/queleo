import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { RssFirebaseService } from 'src/app/services/rss-firebase.service';
import { FirebaseFilter, Condition } from 'src/app/models/firebaseFilter';

@Component({
  selector: 'app-querytest',
  templateUrl: './querytest.component.html',
  styleUrls: ['./querytest.component.css']
})
export class QuerytestComponent implements OnInit {
  
  noticiasRef: AngularFireList<any>;
  noticias: Observable<any[]>;

  constructor(public db: AngularFireDatabase, public RssService: RssFirebaseService) {
    // console.log("Contruyendo QueryTest")
  }

  ngOnInit() {
    // console.log("Iniciando QueryTest")
    this.RssService.findAll({field: 'url', condition: Condition[">="], value: 'https://www.clarin'})
      .subscribe(
        data => {
          // console.log("KOKO", JSON.stringify(data))
        },
        error => {},
        () => {}
    );

    this.db.list('/rss', ref => 
      ref.orderByChild('url').startAt('https://www.clarin')
    ).snapshotChanges().subscribe(
      data => {
        let mapa = data.map(elem => elem.payload.val())
        // console.log(mapa)
      },
      error => {},
      () => {}
    )
        
    
    // this.db.object('/rss/1').snapshotChanges().subscribe(
    //   data => {
    //     console.log("RSS bestia")
    //     console.log(data)
    //   },
    //   error => {},
    //   () => {}
    // )
  }

}
