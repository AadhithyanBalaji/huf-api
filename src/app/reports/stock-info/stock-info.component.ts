import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stock-info',
  templateUrl: './stock-info.component.html',
  styleUrls: ['./stock-info.component.css'],
})
export class StockInfoComponent {
  @Input() qty: number;
  @Input() bags: number;
  @Input() date: Date;
  @Input() info_1: string;
  @Input() info_2: string;
  @Input() info_3: string;
}
