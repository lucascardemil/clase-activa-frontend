import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Level } from 'src/app/models/Level';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LevelService {

    private url = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

    getLevel() {
        return this.http.get(`${this.url}/levels/`);
    }

    getIdLevel(id: number) {
        return this.http.get(`${this.url}/levels/${id}`);
    }

    addLevel(nivel: Level) {
        return this.http.post(`${this.url}/levels/addLevel`, nivel);
    }

    updateLevel(nivel: Level) {
        return this.http.put(`${this.url}/levels/updateLevel`, nivel);
    }

    deleteLevel(id: number) {
        return this.http.delete(`${this.url}/levels/deleteLevel/${id}`);
    }


}
