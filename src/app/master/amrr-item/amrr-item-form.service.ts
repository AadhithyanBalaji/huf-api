import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import {
  GridColumnType,
  IAmmrGridColumn,
} from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { AmrrModalComponent } from 'src/app/shared/amrr-modal/amrr-modal.component';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { AmrrItemEditorComponent } from './amrr-item-editor/amrr-item-editor.component';
import { AmrrItem } from './amrr-item-editor/amrr-item.model';

@Injectable()
export class AmrrItemFormService {
  columns: IAmmrGridColumn[];
  dataSource: MatTableDataSource<AmrrItem, MatPaginator>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly apiBusinessService: ApiBusinessService
  ) {}

  init() {
    this.columns = this.getColumns();
    this.getData();
  }

  addNewItem() {
    this.dialog
      .open(AmrrItemEditorComponent)
      .afterClosed()
      .subscribe((result) => (result ? this.getData() : null));
  }

  onEdit(event: AmrrItem) {
    this.dialog
      .open(AmrrItemEditorComponent, {
        data: event,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) =>
        result
          ? setTimeout(() => {
              this.getData();
            }, 1000)
          : null
      );
  }

  onDelete(event: AmrrItem) {
    this.dialog
      .open(AmrrModalComponent, {
        data: {
          title: 'Confirm Deletion',
          body: `Are you sure you want to delete the item - ${event.name} ?`,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.deleteItem(event.id);
        }
      });
  }

  private getData() {
    this.apiBusinessService
      .get('item')
      .pipe(take(1))
      .subscribe(
        (data) => (this.dataSource = new MatTableDataSource(data as AmrrItem[]))
      );
  }

  private deleteItem(itemId: number) {
    this.apiBusinessService
      .delete('item', itemId)
      .pipe(take(1))
      .subscribe((_) => this.getData());
  }

  private getColumns(): IAmmrGridColumn[] {
    return [
      {
        key: 'itemId',
        name: 'S.No.',
      },
      {
        key: 'itemGroupId',
        name: 'Item Group Id',
        hidden: true
      },
      {
        key: 'itemGroup',
        name: 'Group Name',
      },
      {
        key: 'name',
        name: 'Item Name',
      },
      {
        key: 'unit',
        name: 'Unit',
      },
      {
        key: 'isActive',
        name: 'Status',
        type: GridColumnType.Boolean,
      },
    ];
  }
}
