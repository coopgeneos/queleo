import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaOrd'
})
export class FechaOrdPipe implements PipeTransform {
  
  transform(items: any[], filter: string): any {
    let result=items;
    if (!items || !filter ) {
        return items;
    }
    if(filter=="desc"){
      result.sort(function(a, b){
        return (new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime())
      })
    }
    else if(filter=="asc"){
      result.sort(function(a, b){
        return (new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      })
    }
    console.log(filter)
    return result;
  
  }
}

