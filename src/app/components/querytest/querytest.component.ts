import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CategoryFirestoreService } from 'src/app/services/category-firestore.service';

@Component({
  selector: 'app-querytest',
  templateUrl: './querytest.component.html',
  styleUrls: ['./querytest.component.css']
})
export class QuerytestComponent implements OnInit {

  items: Observable<any[]>;
  db: CategoryFirestoreService;
  private categoriesCollection: AngularFirestoreCollection<any>;

  constructor(db: CategoryFirestoreService) {
    this.db = db;
  }

  ngOnInit() {
    this.db.findAll().subscribe(
      data => {console.log("init", data)},
      error => {console.error(error)},
      () => {}
    )

    /* this.categoriesCollection = this.db.collection<any>('rss');
    this.categoriesCollection.snapshotChanges().subscribe(
      data => {
        let cats = data.map(d => {
          let r = d.payload.doc.data();
          r.id = d.payload.doc.id;
          return r;
        })
        console.log("datainit", cats)
      },
      error => {
        console.error(error)
      },
      () => {}
    ) */
  }

}
