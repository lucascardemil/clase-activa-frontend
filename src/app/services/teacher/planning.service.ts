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
        return this.http.get(`${this.url}/plannings/getAllPlanning/${id}`);
    }

    getSelectUnits() {
        return this.http.get(`${this.url}/plannings/getSelectUnits`);
    }

    getSelectAxis() {
        return this.http.get(`${this.url}/plannings/getSelectAxis`);
    }
    
    getIdPlanning(table: string) {
        return this.http.get(`${this.url}/plannings/getIdPlanning/${table}`);
    }

    getIdSubObjective(id: number) {
        return this.http.get(`${this.url}/plannings/getIdSubObjective/${id}`);
    }

    getIdObjective(id: number) {
        return this.http.get(`${this.url}/plannings/getIdObjective/${id}`);
    }

    getIdAttitude(id: number) {
        return this.http.get(`${this.url}/plannings/getIdAttitude/${id}`);
    }

    getIdSkill(id: number) {
        return this.http.get(`${this.url}/plannings/getIdSkill/${id}`);
    }

    getIdIndicator(objective: number, unit: number) {
        return this.http.get(`${this.url}/plannings/getIdIndicator/${objective}/${unit}`);
    }

    getIdAxisSubjects(name: string, subject: string) {
        return this.http.get(`${this.url}/plannings/getIdAxisSubjects/${name}/${subject}`);
    }

    getSubjectForUnit(id: number) {
        return this.http.get(`${this.url}/plannings/getSubjectForUnit/${id}`);
    }

    addPlaningSubjectAxi(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlaningSubjectAxi`, planning);
    }

    addPlaningObjective(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlaningObjective`, planning);
    }

    addPlaningAttitude(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlaningAttitude`, planning);
    }

    addPlaningSkill(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlaningSkill`, planning);
    }

    addPlaning(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlaning`, planning);
    }

    addPlanningUnit(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningUnit`, planning);
    }

    addPlanningAxiObjective(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningAxiObjective`, planning);
    }

    addPlanningUnitObjective(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningUnitObjective`, planning);
    }

    addPlanningSubObjective(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningSubObjective`, planning);
    }

    addPlanningUnitSkill(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningUnitSkill`, planning);
    }
    
    addPlanningUnitAttitude(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningUnitAttitude`, planning);
    }

    addPlanningObjectiveIndicator(planning: Planning) {
        return this.http.post(`${this.url}/plannings/addPlanningObjectiveIndicator`, planning);
    }
}
