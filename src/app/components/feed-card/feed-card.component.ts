import { Component, OnInit, Input } from '@angular/core';
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

  toFavorites() : void {
    alert("Se guardó en favoritos (mentira!)")
  }

  share() : void {
    alert("Compartí a tus amigos!")
  }
}
