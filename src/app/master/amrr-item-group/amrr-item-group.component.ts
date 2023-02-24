import { Component, OnInit } from '@angular/core';
import { AmrrItemGroupFormService } from './amrr-item-group-form.service';

@Component({
  selector: 'app-amrr-item-group',
  templateUrl: './amrr-item-group.component.html',
  styleUrls: ['./amrr-item-group.component.css'],
  providers: [AmrrItemGroupFormService],
})
export class AmrrItemGroupComponent implements OnInit {
  constructor(readonly formService: AmrrItemGroupFormService) {}

  ngOnInit(): void {
    this.formService.init();
  }
}
