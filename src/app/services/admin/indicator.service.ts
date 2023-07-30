import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IndicatorService {

    private url = environment.apiUrl;
    savedPlanningIndicator: any;

    constructor(private http: HttpClient,) { }

    getSelectIndicatorsObjectives() {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/indicators/getSelectIndicatorsObjectives?timestamp=${timestamp}`);
    }

    getSelectIndicators() {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/indicators/getSelectIndicators?timestamp=${timestamp}`);
    }

    getPreviewIndicator(id: number) {
        const timestamp = new Date().getTime();
        return this.http.get(`${this.url}/indicators/getPreviewIndicator/${id}?timestamp=${timestamp}`);
    }

    addIndicator(Indicator: any) {
        return this.http.post(`${this.url}/indicators/addIndicator`, Indicator);
    }

    updateIndicator(Indicator: any) {
        return this.http.put(`${this.url}/indicators/updateIndicator`, Indicator);
    }

    addPlanningIndicator(Indicator: any) {
        return this.http.post(`${this.url}/indicators/addPlanningIndicator`, Indicator);
    }

    updatePlanningIndicator(Indicator: any) {
        return this.http.put(`${this.url}/indicators/updatePlanningIndicator`, Indicator);
    }

    deletePlanningIndicator(Indicator: any) {
        return this.http.post(`${this.url}/indicators/deletePlanningIndicator`, Indicator);
    }

    savePlanningIndicator(planning: any) {
        this.savedPlanningIndicator = planning;
    }
}
