import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SubobjectiveService {

    private url = environment.apiUrl;
    savedPlanningSubObjective: any;

    constructor(private http: HttpClient,) { }

    getSelectSubObjectivesObjectives() {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/subobjectives/getSelectSubObjectivesObjectives?timestamp=${timestamp}`);
    }

    getSelectSubObjectives() {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/subobjectives/getSelectSubObjectives?timestamp=${timestamp}`);
    }

    getPreviewSubObjective(id: number) {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/subobjectives/getPreviewSubObjective/${id}?timestamp=${timestamp}`);
    }

    addSubObjective(subobjective: any) {
        return this.http.post(`${this.url}/subobjectives/addSubObjective`, subobjective);
    }

    updateSubObjective(subobjective: any) {
        return this.http.put(`${this.url}/subobjectives/updateSubObjective`, subobjective);
    }

    addPlanningSubObjective(subobjective: any) {
        return this.http.post(`${this.url}/subobjectives/addPlanningSubObjective`, subobjective);
    }

    updatePlanningSubObjective(subobjective: any) {
        return this.http.put(`${this.url}/subobjectives/updatePlanningSubObjective`, subobjective);
    }

    savePlanningSubObjective(planning: any) {
        this.savedPlanningSubObjective = planning;
    }
}
