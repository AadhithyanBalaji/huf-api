import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stock-qty-bags-card',
  templateUrl: './stock-qty-bags-card.component.html',
  styleUrls: ['./stock-qty-bags-card.component.css'],
})
export class StockQtyBagsCardComponent {
  @Input() title: string;
  @Input() qty = 0;
  @Input() bags = 0;
  @Input() width = '15vw';
}
