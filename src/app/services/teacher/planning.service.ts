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
        return this.http.get(`${this.url}/plannings`);
    }
    
    getIdPlanning(table: string) {
        return this.http.get(`${this.url}/plannings/${table}`);
    }

    getIdSubObjective(id: number) {
        return this.http.get(`${this.url}/plannings/getIdSubObjective/${id}`);
    }

    addPlaning(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlaning`, planning);
    }

    addPlanningUnit(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningUnit`, planning);
    }

    addPlanningAxi(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningAxi`, planning);
    }

    addPlanningObjective(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningObjective`, planning);
    }

    addPlanningSubObjective(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningSubObjective`, planning);
    }

    addPlanningSkill(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningSkill`, planning);
    }
    
    addPlanningAttitude(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningAttitude`, planning);
    }
    
    addPlanningIndicator(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningIndicator`, planning);
    }
}
