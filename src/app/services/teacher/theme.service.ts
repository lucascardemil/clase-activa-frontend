import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Theme } from 'src/app/models/Theme';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    private url = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

    getTheme() {
        return this.http.get(`${this.url}/themes/`);
    }

    getIdTheme(id: number) {
        return this.http.get(`${this.url}/themes/${id}`);
    }

    getThemeForSubject(id: number) {
        return this.http.get(`${this.url}/themes/getThemeForSubject/${id}`);
    }

    addTheme(theme: Theme) {
        return this.http.post(`${this.url}/themes/addTheme`, theme);
    }

    updateTheme(theme: Theme) {
        return this.http.put(`${this.url}/themes/updateTheme`, theme);
    }

    deleteTheme(id: number) {
        return this.http.delete(`${this.url}/themes/deleteTheme/${id}`);
    }

}
