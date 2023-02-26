import { Component, OnInit } from '@angular/core';
import { AmrrUserFormService } from './amrr-user-form.service';

@Component({
  selector: 'app-amrr-user',
  templateUrl: './amrr-user.component.html',
  styleUrls: ['./amrr-user.component.css'],
  providers: [AmrrUserFormService],
})
export class AmrrUserComponent implements OnInit {
  constructor(readonly formService: AmrrUserFormService) {}

  ngOnInit(): void {
    this.formService.init();
  }
}
