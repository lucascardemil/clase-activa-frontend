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

    getIdSubObjective(id: number){
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/plannings/getIdSubObjective/${id}?timestamp=${timestamp}`);
    }

    getIdIndicator(id: number){
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/plannings/getIdIndicator/${id}?timestamp=${timestamp}`);
    }

    getIdSkill(id: number){
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/plannings/getIdSkill/${id}?timestamp=${timestamp}`);
    }

    getIdAttitude(id: number){
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/plannings/getIdAttitude/${id}?timestamp=${timestamp}`);
    }
    
    getIdPlanning(table: string) {
        return this.http.get(`${this.url}/plannings/getIdPlanning/${table}`);
    }

    getSubjectForUnit(id: number) {
        return this.http.get(`${this.url}/plannings/getSubjectForUnit/${id}`);
    }
}
