import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

import { ListService } from '../list.service';
import { ListItem } from '../list-item';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  items: ListItem[] = [];
  action = new FormControl(null, Validators.required);
  description = new FormGroup({});
  checked: boolean;
  length: number;
  pageEvent: PageEvent;
  currentPage: number;
  pageSize: number = 3;

  constructor(private listService: ListService) { }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(checked?): void {
    this.listService.getItems(this.checked)
      .subscribe(response => {
        this.items = response;
        this.length = response.length;
      });
  }

  addItem(): void {
    this.listService.addItem(this.action.value, this.description)
      .subscribe(() => {
        this.getItems(this.checked);
      });
    this.action.reset();
  }

  removeItem(id: number, event): void {
    this.listService.removeItem(id)
      .subscribe(() => this.getItems(this.checked));
      event.stopPropagation();
  }

  check(id: number): void {
    this.listService.check(id)
      .subscribe();
    event.stopPropagation();
  }

  edit(id: number, event): void {
    this.listService.edit(id, this.description)
      .subscribe(() => this.getItems(this.checked));
    event.stopPropagation();
  }

  filter(checked): void {
    this.checked = checked;
    this.getItems(checked);
  }

  pageChanging(event): void {
    this.currentPage = event.pageIndex;
    this.listService.pageChanging(event.pageSize, event.pageSize * event.pageIndex)
      .subscribe(response => this.items = response);
  }
}
