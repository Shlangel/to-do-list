import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ListItem } from '../../interfaces/list-item.interface';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild('listInput') listInput: ElementRef;
  @ViewChild('edit') editBtn: ElementRef;

  items: ListItem[] = [];

  private list = new FormGroup({});
  private prevChecked: boolean;
  private checked: boolean;
  private pageEvent: PageEvent;
  private currentPage = 0;
  private pageSize = 4;
  private length = 0;

  constructor(private listService: ListService) { }

  ngOnInit(): void {
    this.listService.items$
      .subscribe(itemsList => {
        this.items = itemsList.items;
        this.length = itemsList.count;
        this.items.forEach(item => this.list.addControl(
          `${item.id}`, new FormControl({ value: `${item.action}`, disabled: true }, Validators.required)));
        if (this.items.length < 1 && this.currentPage !== 0) {
          this.currentPage -= 1;
          this.getItems();
        }
      });
    this.getItems({
      pageSize: this.pageSize,
      pageIndex: this.currentPage,
    });
  }

  public getItems(event?): void {
    if (event) {
      this.currentPage = event.pageIndex;
    }
    this.listService.getItems(this.checked, event?.pageSize || 4, (event?.pageSize || 4) * (this.currentPage || 0));

  }

  public removeItem(id: number, event): void {
    this.listService.removeItem(id)
      .subscribe(() => this.getItems());
    event.stopPropagation();
  }

  public check(id: number, event): void {
    this.listService.check(id)
      .subscribe();
    event.stopPropagation();
  }

  public edit(id: number, event): void {

    const formControl = this.list.get(`${id}`);

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

  public filter(checked): void {
    this.checked = checked;
    this.currentPage = 0;
    this.getItems();
  }

}
