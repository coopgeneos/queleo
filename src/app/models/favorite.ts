export class Favorite {
  id: string;
  news: string;
  tags: string[];

  constructor() {}

  init(obj: any) : void {
    if(obj){
      this.id = obj.id ? obj.id : null;
      this.news = obj.news ? obj.news : null;
      this.tags = obj.tags ? obj.tags : null;
    }
  }
}