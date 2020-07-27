import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { ListItem } from '../list-item';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  items: ListItem[] = [];
  action = new FormControl(null, Validators.required);

  constructor(private listService: ListService) { }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.listService.getItems()
      .subscribe(items => this.items = items);
  }

  addItem(): void {
    this.listService.addItem(this.action.value)
      .subscribe(() => this.getItems());
    this.action.reset();
  }

  removeItem(id: number, event): void {
    this.listService.removeItem(id)
      .subscribe(() => this.getItems());
      event.stopPropagation();
  }

  check(id: number): void {
    this.listService.check(id)
      .subscribe();
    event.stopPropagation();
  }

}
