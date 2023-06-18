import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AxiService {
    savedPlanningSubjectAxi: any;

    constructor() { }

    savePlanningSubjectAxi(planning: any) {
        this.savedPlanningSubjectAxi = planning;
    }
}
