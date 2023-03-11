import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-amrr-home',
  templateUrl: './amrr-home.component.html',
  styleUrls: ['./amrr-home.component.css'],
})
export class AmrrHomeComponent {
  data: any;
  showFiller = false;
  panelOpenState = false;

  constructor(
    readonly authService: AuthService,
    private readonly router: Router
  ) {
    if (this.router.url === '/') {
      this.router.navigate(['stockInward']);
    }
  }

  logOut() {
    this.authService.logOut();
  }
}
