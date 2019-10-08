import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Category } from '../models/category';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryFirestoreService extends FirestoreService<Category> {
  
  constructor(public db: AngularFirestore) {
    super(db, 'categories')
  }

  parse(json: any): Category {
    const data = json.payload.doc.data() as Category;
    const id = json.payload.doc.id;
    return { id, ...data };
  }
}