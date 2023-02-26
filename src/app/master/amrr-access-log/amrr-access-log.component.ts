import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { IAmmrGridColumn } from 'src/app/shared/ammr-grid/ammr-grid-column.interface';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { AmrrAccessLog } from './amrr-access-log.model';

@Component({
  selector: 'app-amrr-access-log',
  templateUrl: './amrr-access-log.component.html',
  styleUrls: ['./amrr-access-log.component.css'],
})
export class AmrrAccessLogComponent implements OnInit {
  dataSource: MatTableDataSource<AmrrAccessLog, MatPaginator>;
  columns: IAmmrGridColumn[] = [];
  constructor(private readonly apiBusiness: ApiBusinessService) {}

  ngOnInit(): void {
    this.apiBusiness
      .get('auth/accessLog')
      .pipe(take(1))
      .subscribe((data: any) => {
        this.columns = this.getColumns();
        this.dataSource = new MatTableDataSource(
          data.recordset as AmrrAccessLog[]
        );
      });
  }

  private getColumns(): IAmmrGridColumn[] {
    return [
      {
        key: Helper.nameof<AmrrAccessLog>('id'),
        name: 'S.No.',
      },
      {
        key: Helper.nameof<AmrrAccessLog>('name'),
        name: 'Bay Name',
      },
      {
        key: Helper.nameof<AmrrAccessLog>('loginName'),
        name: 'Login Name',
      },
      {
        key: Helper.nameof<AmrrAccessLog>('eventType'),
        name: 'Activity Type',
      },
      {
        key: Helper.nameof<AmrrAccessLog>('eventTime'),
        name: 'Event Time',
      },
    ];
  }
}
