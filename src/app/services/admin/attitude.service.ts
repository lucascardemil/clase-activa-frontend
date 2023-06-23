import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AttitudeService {

    savedPlanningAttitude: any;

    constructor() { }

    savePlanningAttitude(planning: any) {
        this.savedPlanningAttitude = planning;
    }
}
