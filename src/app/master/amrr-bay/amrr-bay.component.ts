import { Component, OnInit } from '@angular/core';
import { AmrrBayFormService } from './amrr-bay-form.service';

@Component({
  selector: 'app-amrr-bay',
  templateUrl: './amrr-bay.component.html',
  styleUrls: ['./amrr-bay.component.css'],
  providers: [AmrrBayFormService],
})
export class AmrrBayComponent implements OnInit {
  constructor(readonly formService: AmrrBayFormService) {}

  ngOnInit(): void {
    this.formService.init();
  }
}
