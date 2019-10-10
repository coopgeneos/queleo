import { Component, OnInit, Input } from '@angular/core';
import { Community } from 'src/app/models/community';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community-card',
  templateUrl: './community-card.component.html',
  styleUrls: ['./community-card.component.css']
})
export class CommunityCardComponent implements OnInit {

  @Input() community: Community;
  
  constructor(private router: Router) { }

  ngOnInit() { }

  goToCommunity() : void {
    this.router.navigate(["/community/"+this.community.id]);
  }

}
