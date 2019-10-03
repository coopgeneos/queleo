import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseFilter, Condition } from '../models/firebaseFilter';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private tree: string;

  constructor(public db: AngularFireDatabase, treeName: string) {
    this.tree = treeName;
  }

  private buildQuery(filter: FirebaseFilter) : firebase.database.Query {
    // this.db.list(`/${this.tree}`).query;
    let query = this.db.list(`/${this.tree}`).query;
    query.orderByChild(filter.field);
    if(filter.condition == Condition["="]) {
      query.equalTo(filter.value)
    }
    if(filter.condition == Condition["<="]) {
      query.endAt(filter.value)
    }
    if(filter.condition == Condition[">="]) {
      query.startAt(filter.value)
    }
    console.log("FirebaseService.buildQuery", query)
    return query;
  }

  findOne(filter: FirebaseFilter) : Observable<any> {
    let query = this.buildQuery(filter);
    query.limitToFirst(1)
    let ref = this.db.list(`/${this.tree}`);
    ref.query = query;
    return ref.snapshotChanges().pipe(map((val, index) => {
      let elem = val[index].payload.val();
      elem['key'] = val[index].key;
      return elem;
    }))
  }

  findAll(filter: FirebaseFilter) : Observable<any> {
    console.log("FindAll")
    let ref = this.db.list(`/${this.tree}`);
    this.buildQuery(filter);
    // console.log(ref.query)
    return ref.snapshotChanges().pipe(map((val, index) => {
      let elem = val[index].payload.val();
      elem['key'] = val[index].key;
      return elem;
    }))
  }

  update() : void {

  }

  replace() : void {

  }
}
