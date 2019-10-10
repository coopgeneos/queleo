export class FeedEntry {
  title: string;
  description: string;
  link: string;
  guid: string;
  pubDate: Date;
  categories: Array<string>;
  creator: string;
  enclosure: {};

  constructor() {}

  init(obj: any) {
    try {
      this.title = obj.title ? obj.title : null;
      this.description = obj.description ? obj.description : null;
      this.link = obj.link ? obj.link : null;
      this.pubDate = obj.pubDate ? new Date(obj.pubDate) : null;
      this.creator = obj['dc:creator'] ? obj['dc:creator'] : null;
      this.enclosure = obj.enclosure && obj.enclosure['@attributes'] ? obj.enclosure['@attributes'] : null;
    } catch(err) {
      throw err;
    }
  }
}
