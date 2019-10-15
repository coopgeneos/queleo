import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Community } from 'src/app/models/community';
import { Rss } from 'src/app/models/rss';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  
  private id: string;
  private community: Community;

  private newMember: string = "";
  private member_error: string = null;

  private newRss: Rss;
  private categories: string[];
  private rss_error: string = null;

  private rssPath: string;
  private sourcesPath: string;

  constructor(
    private activatedRouter: ActivatedRoute,
    private firebaseDB: AngularFireDatabase) { 
    this.activatedRouter.params.subscribe(
      params => { 
        this.id = params['id']; 
      }
    );
    this.community = new Community();
    this.newRss = new Rss();
  }

  ngOnInit() {
    this.rssPath = `/communities/${this.id}/rss`;
    this.sourcesPath = `/communities/${this.id}/sources`;

    this.firebaseDB.object('/communities/'+this.id).snapshotChanges().subscribe(
      data => {
        this.community = new Community();
        this.community.init(data.payload.val())
        this.community.id = data.key;
      },
      error => {
        console.error(error)
      }
    );

    this.firebaseDB.list<string[]>('/categories').snapshotChanges().subscribe(
      data => {
        this.categories = data.map(cat => {return cat.payload.val().toString()})
      },
      error => {
        console.error(error)
      }
    )
  }

  addMember() : void {
    this.firebaseDB.list('/users', ref => 
      ref.orderByChild('email').equalTo(this.newMember)).snapshotChanges().subscribe(
        user => {
          if(user && !user.length) 
            this.member_error = "El correo no pertence a un usuario registrado";
          else {
            this.member_error = "Se agregó el usuario correctamente";
            this.community.members.push(this.newMember);
            this.firebaseDB.object(`/communities/${this.id}/members`).set(this.community.members);
            this.newMember = null;
          } 
          setTimeout(() => {this.member_error = null}, 3000)
        }
      )
  }

  removeMember(email: string) : void {
    let index = this.community.members.findIndex((member, index) => {
      return member == email;
    });
    this.community.members.splice(index,1)
    this.firebaseDB.object(`/communities/${this.id}/members`).set(this.community.members);
  }

  addRss() : void {
    // console.log(!this.newRss, !this.newRss.source, !this.newRss.category, !this.newRss.url)
    if(!this.newRss || !this.newRss.source || !this.newRss.category || !this.newRss.url ) {
      this.rss_error = "El RSS esta mal formado";
      setTimeout(() => {this.rss_error = null}, 3000);
      return
    }
    let rss = this.community.rss.find(elem => {
      return elem.url.toLowerCase() == this.newRss.url.toLowerCase();
    });
    if(!rss && this.newRss.source && this.newRss.category) {
      this.community.rss.push(this.newRss);
      this.firebaseDB.object(`/communities/${this.id}/rss`).set(this.community.rss);
      if(!this.community.sources.includes(this.newRss.source.toLowerCase())){
        this.firebaseDB.object(`/communities/${this.id}/sources`).set(this.community.sources);
      }       
      this.newRss = new Rss();
    } else {
      this.rss_error = "El RSS ya existe";
      setTimeout(() => {this.rss_error = null}, 3000)
    } 
  }

  removeRss(rss: Rss) {
    let index = this.community.rss.findIndex((elem, index) => {
      return elem.url == rss.url;
    });
    this.community.rss.splice(index,1);
    this.firebaseDB.object(`/communities/${this.id}/rss`).set(this.community.rss);
  }

  selectCategory(value: string) {
    this.newRss.category = value.toLowerCase();
  }

}
