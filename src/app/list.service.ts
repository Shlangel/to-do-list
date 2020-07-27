import { Injectable } from '@angular/core';
import { ListItem } from './list-item';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  items: ListItem[]  = [
    {id: 1, checked: false, action: 'do this again'},
  ];

  getItems(): Observable<ListItem[]> {
    return of(this.items);
  }

  addItem(action): Observable<ListItem> {
    const item = {
      id: this.genId(this.items),
      action: action,
      checked: false
    };
    this.items.push(item);
    return of(item);
  }

  removeItem(id: number): Observable<string> {
    this.items = this.items.filter(items => items.id !== id);
    return of('ok');
  }

  check(id: number): Observable<string> {
    const item = this.items.find(item => item.id === id);
    item.checked = !item.checked;
    return of('ok');
  }

  genId(items: ListItem[]): number {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }
}
