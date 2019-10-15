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

  private repairXML(xml: string) : string {
    let fixed = xml.replace(/<!\[CDATA\[|\]\]>/g, "");
    fixed = fixed.toString().replace(/&/g, "&amp;");
    return fixed;
  }

  private parseToRSSJson(json: any, rss: Rss) : FeedEntry[] {
    try {
      let items = this.getItems(json);
      return items.map(item => {
        let feed = new FeedEntry();
        feed.init(item);
        this.fixFeedEntry(feed, item, rss)
        return feed;
      });
    } catch(err) {
      throw ` Error parsing: ${rss.source}
              ${rss.url} 
              ${err}`;
    }
  }

  private getItems(json: any) : any[] {
    if(json.rss && json.rss.channel && json.rss.channel.item){
      // console.log(this.getValueOf(json, 'json.rss.channel.item'));
      return json.rss.channel.item;
    }
      
    if(json.feed && json.feed.entry){
      // console.log(this.getValueOf(json, 'json.feed.entry'));
      return json.feed.entry;
    }
  }

  private fixFeedEntry(feed: FeedEntry, obj: any, rss: Rss) : void {
    // Fix creator
    if(feed.creator == null) {
      feed.creator = this.getValueOf(obj, 'author.name');
      feed.creator = feed.creator ? feed.creator : rss.source;
    } 
    // Fix pubDate
    if(feed.pubDate == null) {
      feed.pubDate = obj['updated'] ? new Date(obj['updated']) : null;
    }
    // Fix link
    if(typeof feed.link != 'string') {
      feed.link = this.getValueOf(obj, 'link.@attributes.href');
    }
    // Fix image
    if(feed.image == null) {
      feed.image = this.getValueOf(obj, 'content.div.img.@attributes.src');
    }
  }

  private getValueOf(obj: any, prop: string) : any {
    let props = prop.split(".");
    let intermediate = 'obj';
    try {
      for(let i=0; i<props.length; i++){
        intermediate = intermediate + `['${props[i]}']`;
        if(eval(intermediate) === 'undefined')
          throw `${intermediate} is undefined`
      }
      return eval(intermediate)
    } catch(err) {
      return null;
    }
  }
}
