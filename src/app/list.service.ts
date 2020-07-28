import { Injectable } from '@angular/core';
import { ListItem } from './list-item';
import { Observable, of } from 'rxjs';
import { Validators, FormControl } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ListService {

  items: ListItem[]  = [
  ];

  getItems(checked?: boolean): Observable<ListItem[]> {
    if (checked) {
      let sortedItems = this.items.filter(item => item.checked === true);
      return of(sortedItems);
    }
    if (checked === false) {
      let sortedItems = this.items.filter(item => item.checked === false);
      return of(sortedItems);
    }
    return of(this.items);
  }

  addItem(action: string, description): Observable<ListItem> {
    const item = {
      id: this.genId(this.items),
      action: action,
      checked: false
    };
    this.items.push(item);
    description.addControl(`${item.id}`, new FormControl({value: `${action}`, disabled: true}, Validators.required));
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

  edit(id: number, description): Observable<string> {
    const formControl = description.get(`${id}`);
    formControl.disabled? formControl.enable() : formControl.disable();
    return of('ok');
  }

  genId(items: ListItem[]): number {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

  pageChanging(limit: number, offset: number, ): Observable<ListItem[]> {
    return of(this.items.slice(offset, offset + limit));
  }

  // pageChanging(limit: number, offset: number, checked?: boolean): Observable<ListItem[]> {
  //   if (checked) {
  //     let sortedItems = this.items.filter(item => item.checked === true).slice(offset, offset + limit);
  //     return of(sortedItems);
  //   }
  //   if (checked === false) {
  //     let sortedItems = this.items.filter(item => item.checked === false).slice(offset, offset + limit);
  //     return of(sortedItems);
  //   }
  //   return of(this.items.slice(offset, offset + limit));
  // }
}
