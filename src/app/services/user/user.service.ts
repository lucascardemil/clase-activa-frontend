import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../../models/User';
import decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private url = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private jwtHelper: JwtHelperService,
        private router: Router
    ) { }

    singIn(user: User) {
        return this.http.post(`${this.url}/users/signIn`, user);
    }

    singUp(user: User) {
        return this.http.post(`${this.url}/users/signUp`, user);
    }

    getUserId(id: any) {
        return this.http.get(`${this.url}/users/${id}`);
    }

    updateInfoPerson(user: User) {
        return this.http.put(`${this.url}/users/updateInfoPerson`, user);
    }

    changePasswordUser(user: User) {
        return this.http.put(`${this.url}/users/changePasswordUser`, user);
    }   


    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/acceso']);
    }

    getAuthStatus(){
        const token = localStorage.getItem('token');

        if (token !== null) {
            if (this.jwtHelper.isTokenExpired(token) !== true) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    getUserlogged(searchTerm: string) {
        let text = '';

        const token = localStorage.getItem('token');
        if (token) {
            const users: any = decode(token);

            switch (searchTerm) {
                case 'name': {
                    text = users.name
                }
                    break;
                case 'id': {
                    text = users.id
                }
                    break;
                case 'role': {
                    text = users.role
                }
            }

        }
        return text;
    }
}


