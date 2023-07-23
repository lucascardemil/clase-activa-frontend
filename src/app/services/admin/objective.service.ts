import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveService {
    private url = environment.apiUrl;
    savedPlanningObjective: any;

    constructor(private http: HttpClient,) { }

    getSelectObjectives() {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/objectives/getSelectObjectives?timestamp=${timestamp}`);
    }

    getIdObjective(id: number) {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/objectives/getIdObjective/${id}?timestamp=${timestamp}`);
    }

    addPlaningObjective(objective: any) {
        return this.http.post(`${this.url}/objectives/addPlaningObjective`, objective);
    }

    updatePlaningObjective(objective: any) {
        return this.http.put(`${this.url}/objectives/updatePlaningObjective`, objective);
    }

    savePlanningObjective(planning: any) {
        this.savedPlanningObjective = planning;
    }
}
