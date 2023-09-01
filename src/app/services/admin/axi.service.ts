import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AxiService {
    private url = environment.apiUrl;
    savedPlanningSubjectAxi: any;

    constructor(private http: HttpClient,) { }

    getSelectAxis() {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/axis/getSelectAxis?timestamp=${timestamp}`);
    }

    getSelectAxisObjectives() {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/axis/getSelectAxisObjectives?timestamp=${timestamp}`);
    }

    getIdAxisSubjects(name: string, subject: string) {
        return this.http.get(`${this.url}/axis/getIdAxisSubjects/${name}/${subject}`);
    }

    getAxiForSubjectAndCourse(id: any) {
        return this.http.get(`${this.url}/axis/getAxiForSubjectAndCourse/${id}`);
    }

    addPlaningSubjectAxi(axis: any) {
        return this.http.post(`${this.url}/axis/addPlaningSubjectAxi`, axis);
    }

    addPlanningAxiObjective(axis: any) {
        return this.http.post(`${this.url}/axis/addPlanningAxiObjective`, axis);
    }

    updatePlanningAxiObjective(axis: any) {
        return this.http.put(`${this.url}/axis/updatePlanningAxiObjective`, axis);
    }

    deletePlanningAxiObjective(axis: any) {
        return this.http.post(`${this.url}/axis/deletePlanningAxiObjective`, axis);
    }

    savePlanningSubjectAxi(planning: any) {
        this.savedPlanningSubjectAxi = planning;
    }
}
