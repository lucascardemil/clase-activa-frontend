import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'src/app/models/Subject';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private url = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

    getSubject() {
        return this.http.get(`${this.url}/subjects/`);
    }

    getAllLevelsWithoutCourses() {
        return this.http.get(`${this.url}/levels/levelsWithoutCourses`);
    }

    getIdSubject(id: number) {
        return this.http.get(`${this.url}/subjects/${id}`);
    }

    getSubjectForCourse(id: number) {
        return this.http.get(`${this.url}/subjects/getSubjectForCourse/${id}`);
    }

    addSubject(subject: Subject) {
        return this.http.post(`${this.url}/subjects/addSubject`, subject);
    }

    updateSubject(subject: Subject) {
        return this.http.put(`${this.url}/subjects/updateSubject`, subject);
    }

    deleteSubject(id: number) {
        return this.http.delete(`${this.url}/subjects/deleteSubject/${id}`);
    }


}
