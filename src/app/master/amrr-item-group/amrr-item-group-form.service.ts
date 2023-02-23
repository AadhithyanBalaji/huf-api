import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import {
  GridColumnType,
  IAmmrGridColumn,
} from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { AmrrModalComponent } from 'src/app/shared/amrr-modal/amrr-modal.component';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import { AmrrItemGroupEditorComponent } from './amrr-item-group-editor/amrr-item-group-editor.component';
import { AmrrItemGroup } from './amrr-item-group-editor/amrr-item-group.model';

@Injectable()
export class AmrrItemGroupFormService {
  columns: IAmmrGridColumn[];
  dataSource: any;
  loading = true;

  constructor(
    private readonly dialog: MatDialog,
    private readonly apiBusinessService: ApiBusinessService
  ) {}

  init() {
    this.columns = [
      {
        key: 'ItemGroupId',
        name: 'S.No.',
      },
      {
        key: 'Name',
        name: 'Item Group',
      },
    ];
    this.getData();
  }

  addNewItemGroup() {
    this.dialog
      .open(AmrrItemGroupEditorComponent)
      .afterClosed()
      .subscribe((result) => {
        this.getData();
      });
  }

  onEdit(event: any) {
    this.dialog
      .open(AmrrItemGroupEditorComponent, {
        data: {
          itemGroupId: event.ItemGroupId,
          name: event.Name,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        setTimeout(() => {
          this.getData();
        }, 1000);
      });
  }

  onDelete(event: any) {
    this.dialog
      .open(AmrrModalComponent, {
        data: {
          title: 'Confirm Deletion',
          body: `Are you sure you want to delete the item group - ${event.Name} ?`,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.deleteItemGroup(event.ItemGroupId);
        }
      });
  }

  private getData() {
    this.loading = true;
    this.apiBusinessService
      .get('itemGroup')
      .pipe(take(1))
      .subscribe((data) => {
        this.dataSource = new MatTableDataSource(data as AmrrItemGroup[]);
        this.loading = false;
      });
  }

  private deleteItemGroup(itemGroupId: number) {
    this.loading = true;
    this.apiBusinessService
      .delete('itemGroup', itemGroupId)
      .pipe(take(1))
      .subscribe((_) => this.getData());
  }
}
