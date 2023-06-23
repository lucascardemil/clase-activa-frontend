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
        return this.http.get(`${this.url}/axis/getSelectAxis`);
    }

    getIdAxisSubjects(name: string, subject: string) {
        return this.http.get(`${this.url}/axis/getIdAxisSubjects/${name}/${subject}`);
    }

    addPlaningSubjectAxi(axis: any) {
        return this.http.post(`${this.url}/axis/addPlaningSubjectAxi`, axis);
    }

    addPlanningAxiObjective(axis: any) {
        return this.http.post(`${this.url}/axis/addPlanningAxiObjective`, axis);
    }

    updatePlaningSubjectAxi(axis: any) {
        return this.http.put(`${this.url}/axis/updatePlaningSubjectAxi`, axis);
    }

    savePlanningSubjectAxi(planning: any) {
        this.savedPlanningSubjectAxi = planning;
    }
}
