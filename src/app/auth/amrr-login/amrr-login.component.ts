import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-amrr-login',
  templateUrl: './amrr-login.component.html',
  styleUrls: ['./amrr-login.component.css'],
})
export class AmrrLoginComponent {
  constructor(private readonly authService: AuthService) {}

  login() {
    this.authService.login('', '');
  }
}
