import { Injectable } from '@angular/core';
import { ListItem } from './list-item';
import { Observable, of } from 'rxjs';
import { Validators, FormControl } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ListService {
  items: ListItem[] = [];
  storageItems = [];

  getItems(checked?: boolean, limit?: number, offset?: number): Observable<any> {
    
    if (this.storageItems.length !== 0) {
      localStorage.setItem('items', JSON.stringify(this.storageItems));
    } else if (this.storageItems.length === 0) {
      this.storageItems = JSON.parse(localStorage.getItem('items'));
    }
    console.log(this.storageItems)
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
      id: this.items.length + 1,
      action: action,
      checked: false
    };
    console.log(this.storageItems)
    this.items.unshift(item);
    return of('ok');
  }

  removeItem(id: number): Observable<string> {
    console.log(this.storageItems)
    this.storageItems = this.storageItems.filter(items => items.id !== id);
    return of('ok');
  }

  check(id: number): Observable<string> {
    const item = this.items.find(item => item.id === id);
    item.checked = !item.checked;
    return of('ok');
  }

  edit(id: number, description): Observable<string> {
    let formControl = description.get(`${id}`); 
    formControl.disabled ? formControl.enable() : formControl.disable();
    return of('ok');
  }

  pageChanging(limit: number, offset: number): Observable<ListItem[]> {
    return of(this.items.slice(offset, offset + limit));
  }

}

// description.addControl(`${item.id}`, new FormControl({value: `${action}`, disabled: true}, Validators.required));
