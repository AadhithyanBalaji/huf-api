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
import Helper from 'src/app/shared/helper';
import { AmrrUserEditorComponent } from './amrr-user-editor/amrr-user-editor.component';
import { AmrrUser } from './amrr-user-editor/amrr-user.model';

@Injectable()
export class AmrrUserFormService {
  columns: IAmmrGridColumn[];
  dataSource: MatTableDataSource<AmrrUser, MatPaginator>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly apiBusinessService: ApiBusinessService
  ) {}

  init() {
    this.columns = this.getColumns();
    this.getData();
  }

  addNewUser() {
    this.dialog
      .open(AmrrUserEditorComponent)
      .afterClosed()
      .subscribe((result) => (result ? this.getData() : null));
  }

  onEdit(event: AmrrUser) {
    this.dialog
      .open(AmrrUserEditorComponent, {
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

  onDelete(event: AmrrUser) {
    this.dialog
      .open(AmrrModalComponent, {
        data: {
          title: 'Confirm Deletion',
          body: `Are you sure you want to delete the user - ${event.name} ?`,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.deleteUser(event.id);
        }
      });
  }

  private getData() {
    this.apiBusinessService
      .get('user')
      .pipe(take(1))
      .subscribe(
        (data) => (this.dataSource = new MatTableDataSource(data as AmrrUser[]))
      );
  }

  private deleteUser(id: number) {
    this.apiBusinessService
      .delete('user', id)
      .pipe(take(1))
      .subscribe((_) => this.getData());
  }

  private getColumns(): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<AmrrUser>('sno'),
        name: 'S.No.',
      },
      {
        key: Helper.nameof<AmrrUser>('name'),
        name: 'Real Name',
      },
      {
        key: Helper.nameof<AmrrUser>('mobileNumber'),
        name: 'Mobile Number',
      },
      {
        key: Helper.nameof<AmrrUser>('loginName'),
        name: 'Login Name',
      },
      {
        key: Helper.nameof<AmrrUser>('password'),
        name: 'Password',
        hidden: true
      },
      {
        key: Helper.nameof<AmrrUser>('userRole'),
        name: 'User Role',
      },
      {
        key: Helper.nameof<AmrrUser>('godowns'),
        name: 'Godown',
      },
      {
        key: Helper.nameof<AmrrUser>('isActive'),
        name: 'Status',
        type: GridColumnType.Boolean,
      },
      {
        key: Helper.nameof<AmrrUser>('isSuperAdmin'),
        name: 'isSuperAdmin',
        hidden: true
      },
    ];
  }
}
