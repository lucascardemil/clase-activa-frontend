import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { UserService } from '../services/user/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private userService: UserService
    ) { }

    canActivate(): boolean | Promise<boolean> {
        var isAuthenticated = this.userService.getAuthStatus();
        if (!isAuthenticated) {
            this.userService.logout();
        }
        return isAuthenticated;
    }

}
