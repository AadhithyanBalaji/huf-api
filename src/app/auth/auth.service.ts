import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private readonly apiBusinessService: ApiBusinessService,
    private readonly snackBar: MatSnackBar
  ) {
    const authData = localStorage.getItem('authData');
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
    this.isAuthenticated =
      Helper.isTruthy(storedIsAuthenticated) && storedIsAuthenticated === '1';
    if (Helper.isTruthy(authData) && authData != '') {
      this.authData = JSON.parse(authData!);
    }
  }

  login(username: string, password: string) {
    this.apiBusinessService
      .post('auth', { loginName: username, password: password })
      .pipe(take(1))
      .subscribe(
        (res: any) => {
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
        },
        (error) => {
          this.displaySnackBar(error?.error?.message);
        }
      );
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  logOut() {
    this.apiBusinessService
      .get(`auth/logout/${this.authData.userId}`)
      .pipe(take(1))
      .subscribe((res: any) => {
        this.displaySnackBar('Logged out');
      });
    this.setIsAuthenticated(false);
    localStorage.setItem('authData', '');
    this.router.navigate(['login']);
  }

  changePwd(loginName: string, password: string, newPassword: string) {
    this.apiBusinessService
      .post('auth/changePassword', {
        loginName: loginName,
        password: password,
        newPassword: newPassword,
      })
      .pipe(take(1))
      .subscribe((res: any) => {
        if (Helper.isTruthy(res.Message) && res.Message !== '') {
          this.displaySnackBar(res.Message);
        } else {
          this.displaySnackBar('Successfully changed password');
          this.logOut();
        }
      });
  }

  getUserId(): number {
    if (Helper.isTruthy(this.authData.userId)) return this.authData.userId;
    const authData = localStorage.getItem('authData');
    if (Helper.isTruthy(authData) && authData != '') {
      const data = JSON.parse(authData!) as AuthData;
      return data?.userId;
    }
    throw new Error('User Id not found in cache');
  }

  private setIsAuthenticated(isAuthenticated: boolean) {
    localStorage.setItem('isAuthenticated', isAuthenticated ? '1' : '0');
    this.isAuthenticated = isAuthenticated;
  }

  private displaySnackBar(msg: string) {
    this.snackBar.open(msg, '', { duration: 3000 });
  }
}
