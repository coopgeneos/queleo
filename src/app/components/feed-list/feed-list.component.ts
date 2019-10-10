import { Component, OnInit, Input } from '@angular/core';
import { FeedService } from 'src/app/services/feed.service';
import { FeedEntry } from 'src/app/models/feed-entry';
import { AngularFireDatabase } from 'angularfire2/database';
import { Rss } from 'src/app/models/rss';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.css']
})
export class FeedListComponent implements OnInit {

  @Input() rssPath: string;
  @Input() sourcesPath: string;

  rssList: Rss[];
  feeds: FeedEntry[] = [];
  filteredFeeds: FeedEntry[] = [];
  hiddenFields: string[] = [];

  constructor(
    private feedService: FeedService,
    private firebaseDB: AngularFireDatabase) {  
     if(!this.rssPath) this.rssPath = '/rssx';
     if(!this.sourcesPath) this.sourcesPath = null;
    }

  ngOnInit() {
    this.loadRss();
  }

  loadRss() {
    this.firebaseDB.list(this.rssPath).snapshotChanges().subscribe(
      data => {
        this.rssList = data.map(elem => {
          let rss = new Rss();
          rss.init(elem.payload.val())
          return rss
        });
        this.loadFeeds({order: "desc"});
      },
      error => {
        alert('Hubo un error leyendo los RSS desde firebase')
      },
      () => {}
    )
  }

  loadFeeds(filter: any) {
    this.feeds = [];

    // Aplico filtros que se pueden aplicar sobre RSS: Categorias, fuentes, ocultar campos
    let filteredRSS = [];
    if(filter) {
      this.hiddenFields = filter.hiddenFields ? filter.hiddenFields : [];

      if(filter.sources) {
        filter.sources.forEach(source => {
          filteredRSS = filteredRSS.concat(this.rssList.filter(rss => {
            return rss.source == source;
          }))
        })
      } 
        
      if(filter.categories) {
        let filtered = [];
        filter.categories.forEach(categ => {
          filtered = filtered.concat(filteredRSS.filter(rss => {
            return rss.category == categ;
          }))
        });
        filteredRSS = filtered; 
      }
    }

    filteredRSS = filter && filter.sources && filter.categories ? filteredRSS : [...this.rssList];

    // Busco las noticias
    let all_news = [];
    filteredRSS.forEach(rss => {
      all_news.push(this.feedService.getFeedContent(rss));
    });
    Promise.all(all_news)
      .then(arrays => {
        arrays.forEach(array => { this.feeds = this.feeds.concat(array)})
      })
      .then(() => {
        // filtros post consulta RSS: titulo, ordenamiento
        if(filter) {
          if(filter.title) {
            this.feeds = this.feeds.filter(news => {return news.title.toString().toLowerCase().includes(filter.title.toLowerCase())})
          }
          if(filter.order == "asc") {
            this.feeds.sort((fa, fb) => {
              if (fa.pubDate < fb.pubDate) return -1;
              if (fa.pubDate > fb.pubDate) return 1;
              return 0;
            })
          } else {
            this.feeds.sort((fa, fb) => {
              if (fa.pubDate < fb.pubDate) return 1;
              if (fa.pubDate > fb.pubDate) return -1;
              return 0;
            })
          }
        }
      })
      .catch(err => {
        alert(err)
      })
  }

  deleteDuplicated(original_array: any[], field: string) : any[] {
    let array = [... original_array];
    for(let i=0; i<array.length; i++){
      let jlength = array.length
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
