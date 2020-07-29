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
  pageEvent: PageEvent;
  currentPage: number = 0;
  pageSize: number = 3;
  length: number;
  event;

  constructor(
    private listService: ListService,
    ) { }

  ngOnInit(): void {
    this.getItems();

  }

  getItems( event?, checked?: boolean): void {

    this.event = event || this.event;

    this.currentPage = this.event ? this.event.pageIndex : this.currentPage;
    console.log(this.currentPage);

    this.listService.getItems(this.checked, this.pageSize, this.pageSize * this.currentPage)
      .subscribe(response => {
        this.length = response.length;
        this.items = response.items;
      });
  }

  addItem(): void {
    let value = this.action.value.trim();
    if (!value) { 
      this.action.reset();
      return; 
    }
    this.listService.addItem(value, this.description)
      .subscribe(() => {
        this.getItems(null);
      });
    this.action.reset();
  }

  removeItem(id: number, event): void {
    this.listService.removeItem(id)
      .subscribe(() => this.getItems(null));
      event.stopPropagation();
  }

  check(id: number): void {
    this.listService.check(id)
      .subscribe();
    event.stopPropagation();
  }

  edit(id: number, event): void {
    this.listService.edit(id, this.description)
      .subscribe(() => this.getItems(null));
    event.stopPropagation();
  }

  filter(checked): void {
    this.checked = checked;
    this.getItems(null, checked);
  }


  // pageChanging(event): void {
  //   this.currentPage = event.pageIndex;
  //   this.listService.pageChanging(event.pageSize, event.pageSize * event.pageIndex)
  //     .subscribe(response => this.items = response);
  //     console.log(event);
  // }

  // getItems( event?, checked?: boolean): void {
  //   this.currentPage = this.checked == checked ? this.currentPage : 0;
  //   this.checked = checked;

  //   this.event = event || this.event;

  //   this.currentPage = this.event ? this.event.pageIndex : this.currentPage;

  //   console.log(this.currentPage)
  //   this.listService.getItems(this.checked, this.pageSize, this.pageSize * this.currentPage)
  //     .subscribe(response => {
  //       this.length = response.length;
  //       this.items = response.items;
  //     });
  // }
  
}
