import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SkillService {

    savedPlanningSkill: any;

    constructor() { }

    savePlanningSkill(planning: any) {
        this.savedPlanningSkill = planning;
    }
}
