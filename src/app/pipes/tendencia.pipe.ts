import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tendencia'
})
export class TendenciaPipe implements PipeTransform {

  transform(items: any[], filter: any[]): any {
    if (!items || !filter || filter.length == 0) {
        return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    let result = [];
    let indUsados = [];
    filter.forEach(p => {
      for(let i=0; i<items.length; i++){ 
        if(!indUsados.includes(i)){
          if(items[i].title.includes(p) || items[i].description.includes(p)) {
            result.push(items[i])
            indUsados.push(i) 
          }
        }        
      }
    })
    return result;
  }

}
