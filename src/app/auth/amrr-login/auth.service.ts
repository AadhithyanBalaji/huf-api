import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    serverUrl = '';
    isAuthenticated = false;

    constructor(private readonly router: Router) {}

    login(username: string, password: string) {
        console.log('username: ', username, 'password', password);
        this.isAuthenticated = true;
        this.router.navigate(['stockInward']);
        return true;
    }

    isLoggedIn() {
        return this.isAuthenticated;
    }

    logOut() {
        this.isAuthenticated = false;
        this.router.navigate(['login']);
    }
}