import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveService {

    savedPlanningObjective: any;

    constructor() { }

    savePlanningObjective(planning: any) {
        this.savedPlanningObjective = planning;
    }
}
