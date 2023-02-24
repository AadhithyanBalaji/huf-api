import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { IAmmrGridColumn } from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { AmrrModalComponent } from 'src/app/shared/amrr-modal/amrr-modal.component';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { AmrrItem } from '../amrr-item/amrr-item-editor/amrr-item.model';
import { AmrrItemGroupEditorComponent } from './amrr-item-group-editor/amrr-item-group-editor.component';
import { AmrrItemGroup } from './amrr-item-group-editor/amrr-item-group.model';

@Injectable()
export class AmrrItemGroupFormService {
  columns: IAmmrGridColumn[];
  dataSource: MatTableDataSource<AmrrItemGroup, MatPaginator>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly apiBusinessService: ApiBusinessService
  ) {}

  init() {
    this.columns = this.getColumns();
    this.getData();
  }

  addNewItemGroup() {
    this.dialog
      .open(AmrrItemGroupEditorComponent)
      .afterClosed()
      .subscribe((result) => (result ? this.getData() : null));
  }

  onEdit(row: AmrrItemGroup) {
    this.dialog
      .open(AmrrItemGroupEditorComponent, {
        data: row,
      })
      .afterClosed()
      .subscribe((result) => {
        result
          ? setTimeout(() => {
              this.getData();
            }, 1000)
          : null;
      });
  }

  onDelete(row: AmrrItemGroup) {
    this.apiBusinessService
      .get(`item/itemGroups/${row.id}`)
      .pipe(take(1))
      .subscribe((items: any) => {
        this.getDeleteConfirmationFromUser(row, (items as AmrrItem[]).length);
      });
  }

  private getData() {
    this.apiBusinessService
      .get('itemGroup')
      .subscribe(
        (data) =>
          (this.dataSource = new MatTableDataSource(data as AmrrItemGroup[]))
      );
  }

  private deleteItemGroup(id: number) {
    this.apiBusinessService
      .delete('itemGroup', id)
      .pipe(take(1))
      .subscribe((_) => this.getData());
  }

  private getDeleteConfirmationFromUser(
    row: AmrrItemGroup,
    childItemsCount: number
  ) {
    this.dialog
      .open(AmrrModalComponent, {
        data: {
          title: 'Confirm Deletion',
          body:
            childItemsCount > 0
              ? `There are ${childItemsCount} items associated with this group. Are you sure you want to delete the item group - ${row.name} ?`
              : `Are you sure you want to delete the item group - ${row.name} ?`,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => (result ? this.deleteItemGroup(row.id) : null));
  }

  private getColumns(): IAmmrGridColumn[] {
    return [
      {
        key: 'id',
        name: 'S.No.',
      },
      {
        key: 'name',
        name: 'Item Group',
      },
    ];
  }
}
