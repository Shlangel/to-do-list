import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('mainInput') mainInput: ElementRef;
  @ViewChild('listInput') listInput: ElementRef;
  @ViewChild('edit') editBtn: ElementRef;

  
  items: ListItem[] = [];

  description = new FormGroup({});
  header = new FormGroup({action: new FormControl()})
  prevChecked: boolean;
  checked: boolean;
  pageEvent: PageEvent;
  currentPage: number = 0;
  pageSize: number = 5;
  length: number;
  event;

  constructor(
    private listService: ListService,
    ) { }

  ngOnInit(): void {
    this.getItems();
  }

  get action() {
    return this.header.controls.action;
  }

  getItems(event?, cp?: number): void {

    this.event = event || this.event;

    this.currentPage = cp === 0 ? cp : this.event ? this.event.pageIndex : this.currentPage;

    this.listService.getItems(this.checked, this.pageSize, this.pageSize * this.currentPage)
      .subscribe(response => {
        this.length = response.length;
        this.items = response.items;
        response.items.map(item => this.description.addControl(`${item.id}`, new FormControl({value: `${item.action}`, disabled: true}, Validators.required)));

        if (this.items.length < 1 && this.currentPage !== 0) {
          this.currentPage -= 1;
          this.event.pageIndex = this.currentPage;
          this.listService.getItems(this.checked, this.pageSize, this.pageSize * this.currentPage)
            .subscribe(response => {
              this.length = response.length;
              this.items = response.items;
              response.items.map(item => this.description.addControl(`${item.id}`, new FormControl({value: `${item.action}`, disabled: true}, Validators.required)));
            })
          }}
      );
  }

  addItem(): void {
    let value = this.action.value?.trim();
    if (!value) { 
      this.action.reset();
      return; 
    }
    this.listService.addItem(value)
      .subscribe(() => {
        this.getItems();
        this.mainInput.nativeElement.focus();
      });
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

  edit(id: number, event): void {

    let formControl = this.description.get(`${id}`); 

    if (formControl.enabled) {
      this.listService.edit(id, formControl.value)
      .subscribe(() => {
        this.getItems();
        formControl.disable();
      });
    } else {
      formControl.enable();
      event.target.parentElement.querySelector('input').focus();
    }

    
    
    event.stopPropagation();
  }

  filter(checked): void {
      this.prevChecked = this.checked;
      this.checked = checked;
      if (this.prevChecked !== this.checked) {
        let cp = 0;
        this.getItems(null, cp); 
      }
    }

}
