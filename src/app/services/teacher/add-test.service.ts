import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Test } from 'src/app/models/Test';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AddTestService {

    private url = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

    getTest() {
        return this.http.get(`${this.url}/tests/`);
    }

    getIdTest(id: number) {
        return this.http.get(`${this.url}/tests/${id}`);
    }

    addTest(test: Test) {
        return this.http.post(`${this.url}/tests/addTest`, test);
    }

    updateTest(test: Test) {
        return this.http.put(`${this.url}/tests/updateTest`, test);
    }

    deleteTest(id: number) {
        return this.http.delete(`${this.url}/tests/deleteTest/${id}`);
    }
}
