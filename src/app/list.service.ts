import { Injectable } from '@angular/core';
import { ListItem } from './list-item';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  items: ListItem[] = [];

  getItems(checked?: boolean, limit?: number, offset?: number): Observable<any> {
    
    if (this.items.length !== 0) {
      localStorage.setItem('items', JSON.stringify(this.items));
    } else if (this.items.length === 0) {
      this.items = JSON.parse(localStorage.getItem('items'));
    }
    this.items = JSON.parse(localStorage.getItem('items')) || [];
    
    if (checked) {
      let sortedItems = this.items.filter(item => item.checked === true);
      let slicedItems = sortedItems.slice(offset, offset + limit);
      return of({items: slicedItems, length: sortedItems.length});
    }
    if (checked === false) {
      let sortedItems = this.items.filter(item => item.checked === false)
      let slicedItems = sortedItems.slice(offset, offset + limit);
      return of({items: slicedItems, length: sortedItems.length});
    }
    return of({items: this.items.slice(offset, offset + limit), length: this.items.length});
  }

  addItem(action: string): Observable<string> {
    const item = {
      id: Math.max(...this.items.map(i => i.id), 0) + 1,
      action: action,
      checked: false
    };
    this.items.unshift(item);
    return of('ok');
  }

  removeItem(id: number): Observable<string> {
    this.items = this.items.filter(items => items.id !== id);
    localStorage.setItem('items', JSON.stringify(this.items));
    return of('ok');
  }

  check(id: number): Observable<string> {
    const item = this.items.find(item => item.id === id);
    item.checked = !item.checked;
    return of('ok');
  }

  edit(id: number, value: string): Observable<string> {
    const target = this.items.find(item => item.id === id);
    target.action = value;
    return of('ok');
  }

  pageChanging(limit: number, offset: number): Observable<ListItem[]> {
    return of(this.items.slice(offset, offset + limit));
  }

}
