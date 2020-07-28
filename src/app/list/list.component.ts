import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { ListItem } from '../list-item';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  items: ListItem[] = [];
  action = new FormControl(null, Validators.required);
  description = new FormGroup({});

  constructor(private listService: ListService) { }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(checked?: boolean, unchecked?: boolean): void {
    this.listService.getItems(checked, unchecked)
      .subscribe(items => this.items = items);
  }

  addItem(event): void {
    this.listService.addItem(this.action.value, this.description)
      .subscribe(() => {
        this.getItems();
      });
    this.action.reset();
    event.stopPropagation();
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

  edit(id: number, event): void {
    this.listService.edit(id, this.description)
      .subscribe(() => this.getItems());
    event.stopPropagation();
  }
    
}
