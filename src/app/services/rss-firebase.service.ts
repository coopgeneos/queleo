import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class RssFirebaseService extends FirebaseService {

  constructor(public db: AngularFireDatabase) {
    super(db, 'rss')
  }
}
