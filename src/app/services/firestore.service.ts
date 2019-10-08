import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export abstract class FirestoreService<T> {

  protected db: AngularFirestore;
  protected collection: AngularFirestoreCollection;
  protected root: string;
  protected data: T[];

  constructor(db: AngularFirestore, root: string) {
    this.db = db;
    this.root = root;
    this.collection = this.db.collection<T>(this.root);
    this.data = [];
  }

  ngOnInit() {}

  abstract parse(json: any): T;

  findAll(): Observable<any> {
    return this.collection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        return this.parse(a);
      })));
  }

}