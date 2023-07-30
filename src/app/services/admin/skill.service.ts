import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SkillService {
    private url = environment.apiUrl;
    savedPlanningSkill: any;

    constructor(private http: HttpClient,) { }

    getSelectSkills() {
        return this.http.get(`${this.url}/skills/getSelectSkills`);
    }

    getIdSkill(id: number) {
        return this.http.get(`${this.url}/skills/getIdSkill/${id}`);
    }

    addPlaningSkill(skill: any) {
        return this.http.post(`${this.url}/skills/addPlaningSkill`, skill);
    }

    updatePlaningSkill(skill: any) {
        return this.http.put(`${this.url}/skills/updatePlaningSkill`, skill);
    }
    
    savePlanningSkill(planning: any) {
        this.savedPlanningSkill = planning;
    }
}
