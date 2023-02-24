import { Component, OnInit } from '@angular/core';
import { AmrrGodownFormService } from './amrr-godown-form.service';

@Component({
  selector: 'app-amrr-godown',
  templateUrl: './amrr-godown.component.html',
  styleUrls: ['./amrr-godown.component.css'],
  providers: [AmrrGodownFormService]
})
export class AmrrGodownComponent implements OnInit{
  constructor(readonly formService: AmrrGodownFormService) {}

ngOnInit(): void {
  this.formService.init();
}

}
