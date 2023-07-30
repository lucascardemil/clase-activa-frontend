import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Planning } from 'src/app/models/Planning';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PlanningService {
    private url = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

    getAllPlanning(id?: number) {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/plannings/getAllPlanning/${id}?timestamp=${timestamp}`);
    }
    
    getIdPlanning(table: string) {
        return this.http.get(`${this.url}/plannings/getIdPlanning/${table}`);
    }

    getIdSubObjective(id: number) {
        return this.http.get(`${this.url}/plannings/getIdSubObjective/${id}`);
    }

    getIdIndicator(objective: number, unit: number) {
        return this.http.get(`${this.url}/plannings/getIdIndicator/${objective}/${unit}`);
    }

    getSubjectForUnit(id: number) {
        return this.http.get(`${this.url}/plannings/getSubjectForUnit/${id}`);
    }
}
