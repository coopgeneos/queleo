import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { FeedEntry } from '../models/feed-entry';
import { Rss } from '../models/rss';

@Injectable()
export class FeedService {

  private CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
  parser = new DOMParser();

  constructor(
    private http: Http,
    private ngxXml2jsonService: NgxXml2jsonService
  ) { }

  getFeedContent(rss: Rss) : Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.get(this.CORS_PROXY + rss.url).toPromise()
        .then(xml => {
          xml =  xml['_body'].replace(/<!\[CDATA\[|\]\]>/g, "");
          // console.log("XML crudo", xml)
          let xml_p = this.parser.parseFromString(xml.toString(), 'text/xml');
          // console.log("XML stringifiado", xml_p)
          let json = this.ngxXml2jsonService.xmlToJson(xml_p);
          // console.log("JSON",JSON.stringify(json))
          resolve(this.parseToRSSJson(json, rss))
        })
        .catch(err => { reject(err) })
    });
  }

  parseToRSSJson(json: any, rss: Rss) : FeedEntry[] {
    let items = json.rss.channel.item;
    return items.map(item => {
      return {
        title: item.title,
        description: item.description,
        link: item.link,
        pubDate: Date.parse(item.pubDate),
        creator: item['dc:creator'] ? item['dc:creator'] : rss.source,
        enclosure: item.enclosure && item.enclosure['@attributes'] ? item.enclosure['@attributes'] : null
      }
    });
  }
}
