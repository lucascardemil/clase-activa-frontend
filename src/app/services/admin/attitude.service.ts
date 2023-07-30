import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AttitudeService {
    private url = environment.apiUrl;
    savedPlanningAttitude: any;

    constructor(private http: HttpClient,) { }

    getSelectAttitudes() {
        return this.http.get(`${this.url}/attitudes/getSelectAttitudes`);
    }

    getIdAttitude(id: number) {
        return this.http.get(`${this.url}/attitudes/getIdAttitude/${id}`);
    }

    addPlaningAttitude(attitude: any) {
        return this.http.post(`${this.url}/attitudes/addPlaningAttitude`, attitude);
    }

    updatePlaningAttitude(attitude: any) {
        return this.http.put(`${this.url}/attitudes/updatePlaningAttitude`, attitude);
    }

    savePlanningAttitude(attitude: any) {
        this.savedPlanningAttitude = attitude;
    }
}
