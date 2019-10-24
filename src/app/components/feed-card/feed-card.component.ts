import { Component, OnInit, Input, Output } from '@angular/core';
import { FeedEntry } from 'src/app/models/feed-entry';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThrowStmt } from '@angular/compiler';

const uuidv3 = require('uuid/v3');
@Component({
  selector: 'app-feed-card',
  templateUrl: './feed-card.component.html',
  styleUrls: ['./feed-card.component.css']
})
export class FeedCardComponent implements OnInit {

  @Input() feed: FeedEntry;
  @Input() hiddenFields: string[];
  @Input() loggedUser: User;
  @Output() tagsSeparadosFinal: string[];

  tagsData: string[];
  userData: string;
  tagsAdd: string;
  userID: string;

  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;

  constructor(private afAuth: AngularFireAuth,
    private firebaseDB: AngularFireDatabase,
    private modalService: NgbModal) {
    this.tagsData = [];

  }

  ngOnInit() {
    this.facebook_url = "https://www.facebook.com/sharer.php?u=" + this.feed.link;
    this.twitter_url = "https://twitter.com/intent/tweet?url=" + this.feed.link;
    this.linkedin_url = "https://www.linkedin.com/shareArticle?mini=true&url=" + this.feed.link;
  }

  viewTags(usuario: any, modal): void {
    this.modalService.open(modal)

    console.log(this.tagsData, this.loggedUser);
  }

  addTags() {
    let separadosConEsp = this.tagsAdd.split(' ')
    let separadosSinEsp: string[] = [];
    let separadosFinal;
    for (let i of separadosConEsp) {
      if (i == " " || i == "") {
        console.log(i)

        //separados.splice[i]
      }
      else {
        console.log(i);
        separadosSinEsp.push(i);
        //separadosFinal.push(i) ;
      }
    }
    for (let i of separadosSinEsp) {

      this.tagsSeparadosFinal = i.split(/[\s,]+./);
    }
    this.firebaseDB.list("/users/" + this.loggedUser.id).update("tags", this.loggedUser.tags.concat(this.tagsSeparadosFinal))
    /* for(let i of separadosFinal){
      this.loggedUser.tags.push(i);

    } */

  }
  selectTag(tag: string) {
    if (this.tagsData.includes(tag)) {
      var pos = this.tagsData.indexOf(tag);
      this.tagsData.splice(pos, 1); // así es como se elimina un elemento
    }
    else {
      this.tagsData.push(tag);
    }
    console.log(this.tagsData, tag)
  }
  /* filterByTags(index: number, selected: boolean) : void {
    this.tagsData[index].selected = selected;
    console.log(this.tagsData)
  } */
  addFavorites() {
    let uuid = uuidv3(this.feed.link, uuidv3.DNS);
    let aux: any = [];
    let not: any;
    this.firebaseDB.object("noticias/" + uuid).valueChanges().subscribe(data => {
      not = data;
    });
    console.log(uuid, not)
    if (!not) {
      this.firebaseDB.list("noticias/").update(uuid, {
        author: this.feed.creator,
        description: this.feed.description,
        image: this.feed.image || '',
        link: this.feed.link,
        pubDate: this.feed.pubDate,
        srcRSS: this.feed.link,
        title: this.feed.title
      })
      console.log("as");
    }
    for (let i of this.tagsData) {
      let obj = {};
      obj[i] = true;
      aux.push(obj)
      //console.log(i)

    }
    console.log(aux)
    this.firebaseDB.list("/users/" + this.loggedUser.id + "/favorites").push({ news: uuid, tags: aux })
  }
  viewSocialShare(modal): void {
    this.modalService.open(modal)
  }

}
