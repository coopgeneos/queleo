import { analyzeAndValidateNgModules } from '@angular/compiler';

export class Rss {
  source: string;
  category: string;
  url: string;

  constructor() {}

  init(obj: any) {
    if(obj) {
      if(obj['url']) this.url = obj.url;
      if(obj['source']) this.source = obj.source;
      if(obj['category']) this.category = obj.category;
    }
  }

  equals(other: any) : boolean {
    try{
      <Rss> other;
      return other.url == this.url;
    } catch(err) {
      return false;
    }
    
  }
}