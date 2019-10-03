import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NgxXml2jsonService } from 'ngx-xml2json';

@Injectable()
export class FeedService {

  private CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
  parser = new DOMParser();

  constructor(
    private http: Http,
    private ngxXml2jsonService: NgxXml2jsonService
  ) { }

  getFeedContent(url: string) : Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.get(this.CORS_PROXY + url).toPromise()
        .then(xml => {
          xml =  xml['_body'].replace(/<!\[CDATA\[|\]\]>/g, "");
          // console.log("XML crudo", xml)
          let xml_p = this.parser.parseFromString(xml.toString(), 'text/xml');
          // console.log("XML stringifiado", xml_p)
          let json = this.ngxXml2jsonService.xmlToJson(xml_p);
          // console.log("JSON",JSON.stringify(json))
          resolve(this.parseToRSSJson(json))
        })
        .catch(err => { reject(err) })
    });
  }

  parseToRSSJson(json: any) : any[] {
    let items = json.rss.channel.item;
    return items.map(item => {
      return {
        title: item.title,
        description: item.description,
        link: item.link,
        pubDate: item.pubDate,
        image: item.enclosure && item.enclosure['@attributes'].url ? item.enclosure['@attributes'].url : null
      }
    })
  }
}
