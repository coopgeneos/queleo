import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-feed-filter',
  templateUrl: './feed-filter.component.html',
  styleUrls: ['./feed-filter.component.css']
})
export class FeedFilterComponent implements OnInit {
  @Output() updateFilter = new EventEmitter();

  filterTitle: string = "";
  categories: any[];
  sources: any[];
  order: string = "desc";
  hiddenFields: any[] = [
    {name:"title", selected: false},
    {name:"image", selected: false},
    {name:"description", selected: false},
    {name:"data", selected: false},
  ];

  constructor(private firebaseDB: AngularFireDatabase) { }

  ngOnInit() {
    this.loadCategories();
    this.loadSources();
  }

  loadCategories() : void {
    this.firebaseDB.list('/categories').snapshotChanges().subscribe(
      data => {
        this.categories = data.map(elem => {return {name: elem.key, selected: true}});
      },
      error => {},
      () => {}
    )
  }

  loadSources() : void {
    this.firebaseDB.list('/sources').snapshotChanges().subscribe(
      data => {
        this.sources = data.map(elem => {return {name: elem.key, selected: true}});
      },
      error => {},
      () => {}
    )
  }

  filter() : void {
    let filter = { order: this.order };
    if(this.filterTitle != ""){
      filter['title'] = this.filterTitle;
    }

    let sources_f = this.sources.filter(source => { return source.selected })
    sources_f = sources_f.length > 0 ? sources_f.map(source => { return source.name }) : [];
    if(sources_f.length > 0) {
      filter['sources'] = sources_f;
    }

    let cat_f = this.categories.filter(cat => { return cat.selected })
    cat_f = cat_f.length > 0 ? cat_f.map(cat => { return cat.name }) : [];
    if(cat_f.length > 0) {
      filter['categories'] = cat_f;
    }

    let hidden_f = this.hiddenFields.filter(field => { return field.selected })
    hidden_f = hidden_f.length > 0 ? hidden_f.map(field => { return field.name }) : [];
    if(hidden_f.length > 0) {
      filter['hiddenFields'] = hidden_f;
    }

    // console.log("feed-filter", filter)
    this.updateFilter.emit(filter);
  }

  filterByTitle(value: string) : void {
    this.filterTitle = value;
    this.filter();
  }

  filterByCategory(index: number, selected: boolean) : void {
    this.categories[index].selected = selected;
    this.filter();
  }

  filterBySource(index: number, selected: boolean) : void {
    this.sources[index].selected = selected;
    this.filter();
  }

  changeOrder() : void {
    this.order = this.order == "desc" ? "asc" : "desc";
    this.filter();
  }

  hiddeField(index: number, selected: boolean) : void {
    this.hiddenFields[index].selected = selected;
    this.filter();
  }

}
