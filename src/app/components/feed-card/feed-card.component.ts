import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { FeedEntry } from 'src/app/models/feed-entry';

@Component({
  selector: 'app-feed-card',
  templateUrl: './feed-card.component.html',
  styleUrls: ['./feed-card.component.css']
})
export class FeedCardComponent implements OnInit {

  @Input() feed: FeedEntry;
  @Input() hiddenFields: string[];

  constructor() { }

  ngOnInit() { }

  agregarFavoritos(){

    /* this.pubDate = this.feed.pubDate;
    this.title = this.feed.title;
    this.author = this.feed.author;
    this.link = this.feed.link;
    this.description=this.feed.description;
    this.a.forEach( ( ele ) => this.arr.push(ele) );
    
    this.resultado.emit({
                         pubDate:this.pubDate,
                         title:this.title,
                         author:this.author,
                         description:this.description,
                         link: this.link,
                         carpetas:this.arr}) */

  }
}
