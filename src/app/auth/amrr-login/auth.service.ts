import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { ApiBusinessService } from 'src/app/shared/api-business.service';
import Helper from 'src/app/shared/helper';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authData: AuthData;
  isAuthenticated = false;

  constructor(
    private readonly router: Router,
    private readonly apiBusinessService: ApiBusinessService
  ) {
    const authData = localStorage.getItem('authData');
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
    this.isAuthenticated =
      Helper.isTruthy(storedIsAuthenticated) && storedIsAuthenticated === '1';
    if (Helper.isTruthy(authData)) {
      this.authData = JSON.parse(authData!);
    }
  }

  login(username: string, password: string) {
    this.apiBusinessService
      .post('auth', { loginName: username, password: password })
      .pipe(take(1))
      .subscribe((res: any) => {
        if (res.success) {
          this.setIsAuthenticated(true);
          this.authData = new AuthData();
          this.authData.userId = +res.data.userId;
          this.authData.isAdmin =
            Helper.isTruthy(res.data.isAdmin) && res.data.isAdmin === '1';
          this.authData.userName = res.data.userName;
          localStorage.setItem('authData', JSON.stringify(this.authData));
          this.router.navigate(['stockInward']);
        } else {
          this.router.navigate(['login']);
        }
      });
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  logOut() {
    this.apiBusinessService
      .get(`auth/logout/${this.authData.userId}`)
      .pipe(take(1))
      .subscribe((res: any) => {
        console.log(res);
      });
    this.setIsAuthenticated(false);
    this.router.navigate(['login']);
  }

  private setIsAuthenticated(isAuthenticated: boolean) {
    localStorage.setItem('isAuthenticated', isAuthenticated ? '1' : '0');
    this.isAuthenticated = isAuthenticated;
  }
}
