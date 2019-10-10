import { Component, OnInit } from '@angular/core';
import { Community } from 'src/app/models/community';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.css']
})
export class CommunityListComponent implements OnInit {

  communities: Community[] = [];

  constructor(private firebaseDB: AngularFireDatabase) {}

  ngOnInit() {
    this.getAllCommunities()
      .then(comms => {
        let byOwner = comms.filter(c => {
          return c.owner == localStorage.getItem("logged")
        });
        let byMember = comms.filter(c => {
          return c.members.includes(localStorage.getItem("logged"))
        });
        return byOwner.concat(byMember);
      })
      .then(comms => {
        this.communities = this.deleteDuplicated(comms, 'id');
      })
      .catch(err => {
        console.error("Se mancó", err)
      })
  }

  private getAllCommunities() : Promise<Community[]> {
    return new Promise((resolve, reject) => {
      this.firebaseDB.list('/communities').snapshotChanges().subscribe(
        data => {
          let result = data.map(com => {
            let c = new Community();
            c.init(com.payload.val());
            c.id = com.key;
            return c;
          });
          resolve(result)
        },
        error => {
          reject(error)
        }
      )
    });
  }

  deleteDuplicated(original_array: any[], field: string) : any[] {
    let array = [... original_array];
    for(let i=0; i<array.length; i++){
      for(let j=i+1; j<array.length; j++){
        if(array[i][field] == array[j][field]) {
          array.splice(j, 1);
          j -= 1;
        }
      }
    }
    return array;
  }
}
