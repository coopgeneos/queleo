import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'favorable'
})
export class FavorablePipe implements PipeTransform {

  transform(items: any[], filter: any[]): any {
    if (!items || !filter || filter.length == 0) {
        return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    let result = [];
    let indUsados = [];
    filter.forEach(pbuena => {
      for(let i=0; i<items.length; i++){ 
        if(!indUsados.includes(i)){
          if(items[i].title.includes(pbuena) || items[i].description.includes(pbuena)) {
            result.push(items[i])
            indUsados.push(i) 
          }
        }        
      }
    })

    return result;
  }

 

}
