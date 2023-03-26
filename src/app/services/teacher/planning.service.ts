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

    getAllPlanning() {
        return this.http.get(`${this.url}/plannings/`);
    }
    
    getIdPlanning(table: string) {
        return this.http.get(`${this.url}/plannings/${table}`);
    }

    getIdSubObjective(id: number) {
        return this.http.get(`${this.url}/plannings/getIdSubObjective/${id}`);
    }

    addPlaningUnit(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlaningUnit`, planning);
    }

    addPlanningObjective(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningObjective`, planning);
    }
    
    addPlanningWithObjective(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningWithObjective`, planning);
    }

    addPlanningWithUnit(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningWithUnit`, planning);
    }
}
