import { Component, OnInit } from '@angular/core';
import { AmrrItemFormService } from './amrr-item-form.service';

@Component({
  selector: 'app-amrr-item',
  templateUrl: './amrr-item.component.html',
  styleUrls: ['./amrr-item.component.css'],
  providers: [AmrrItemFormService],
})
export class AmrrItemComponent implements OnInit {
  constructor(readonly formService: AmrrItemFormService) {}

  ngOnInit(): void {
    this.formService.init();
  }
}
