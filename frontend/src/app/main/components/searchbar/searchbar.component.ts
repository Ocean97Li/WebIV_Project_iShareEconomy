import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';

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
  @Output() private newSearch = new EventEmitter<boolean>();
  @Output() private newFilter = new EventEmitter<string[]>();
  constructor() {
    this.filterUser$.subscribe(val => {
      this._filtername = val;
      this.sendNewfilter();
    });

  }
  public sendNewsearch() {
    this.newSearch.emit(true);
  }

  public sendNewfilter() {
    this.newFilter.emit([this._filtername, this.searchType]);
  }

  get filtername(): string {
    return this._filtername;
  }

  get searchType(): string {
    return this._searchType;
  }

  set dissappearAnimation(dis: boolean) {
    this._dissappearAnimation = dis;
  }

  set filtername(name: string) {
    if (name === undefined) {
      name = '';
    }
    this._filtername = name.trim();
    this.sendNewfilter();
  }

  set searchType(searchType: string) {
    if (searchType === undefined) {
      searchType = 'User';
    }
    this._searchType = searchType;
    this.sendNewfilter();
  }

  ngOnInit() {
  }

}
