import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './user/user.service';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token: any = localStorage.getItem('token');
        let tokenHeader: any;

        if(token !== null){
            if (this.jwtHelper.isTokenExpired(token) === true) {
                this.userService.logout()
            }

            tokenHeader = req.clone({
                headers: req.headers.set("x-access-token", token)
            }); 
        }else{
            tokenHeader = req.clone()
            this.userService.logout()
        }

        return next.handle(tokenHeader);
    }
    constructor(private userService: UserService, private jwtHelper: JwtHelperService) { }
}
