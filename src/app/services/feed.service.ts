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
          let xml_s = this.repairXML(xml['_body']);
          // console.log("XML crudo", rss.source, xml_s)
          let xml_p = this.parser.parseFromString(xml_s, 'text/xml');
          // console.log("XML stringifiado", xml_p)
          let json = this.ngxXml2jsonService.xmlToJson(xml_p);
          // console.log("JSON",JSON.stringify(json))
          resolve(this.parseToRSSJson(json, rss))
        })
        .catch(err => { reject(err) })
    });
  }

  repairXML(xml: string) : string {
    let fixed = xml.replace(/<!\[CDATA\[|\]\]>/g, "");
    fixed = fixed.toString().replace(/&/g, "&amp;");
    return fixed;
  }

  parseToRSSJson(json: any, rss: Rss) : FeedEntry[] {
    let items = json.rss.channel.item;
    return items.map(item => {
      let feed = new FeedEntry();
      feed.init(item);
      feed.creator = feed.creator ? feed.creator : rss.source
      return feed;
    });
  }
}
