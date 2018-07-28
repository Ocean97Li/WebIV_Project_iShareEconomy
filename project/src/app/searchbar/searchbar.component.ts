import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs/Subject';
import { debounceTime } from '../../../node_modules/rxjs/operators';
import { ShareType } from '../lend-object/lend-object.model';


@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  public filterUser$ = new Subject<string>();
  public readonly searchTypes = ['User', 'Object', 'Address'];
  @Input() private _dissappearAnimation: boolean;
  @Input() private _searchType: string;
  @Input() private _filtername: string;
  @Output() private newSearch = new EventEmitter<string[]>();
  constructor() {
    this.filterUser$.pipe(debounceTime(400)).subscribe(val => {
      this._filtername = val;
      this.sendNewsearch();
    });

  }

  public sendNewsearch() {
    console.log('new search');
    this.newSearch.emit([this._filtername, this.searchType]);
  }

  get filtername(): string {
    return this._filtername;
  }

  get searchType(): string {
    return this._searchType;
  }

  set dissappearAnimation(dis: boolean) {
    this._dissappearAnimation = dis;
    console.log(dis);
  }

  set filtername(name: string) {
    if (name === undefined) {
      name = '';
    }
    this._filtername = name;
    this.sendNewsearch();
  }

  set searchType(searchType: string) {
    if (searchType === undefined) {
      searchType = 'User';
    }
    this._searchType = searchType;
    this.sendNewsearch();
  }

  ngOnInit() {
  }

}
