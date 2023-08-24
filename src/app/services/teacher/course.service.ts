import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from 'src/app/models/Course';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    private url = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

    getCourse() {
        return this.http.get(`${this.url}/courses/getAllCourses`);
    }

    getIdCourse(id: number) {
        return this.http.get(`${this.url}/courses/getIdCourse/${id}`);
    }

    getCourseForLevel(id: number) {
        return this.http.get(`${this.url}/courses/getCourseForLevel/${id}`);
    }
    
    getAllCourseForSubject() {
        return this.http.get(`${this.url}/courses/getAllCourseForSubject`);
    }

    getCourseForSubjectName(name: string) {
        return this.http.get(`${this.url}/courses/getCourseForSubjectName/${name}`);
    }

    addCourse(curso: Course) {
        return this.http.post(`${this.url}/courses/addCourse`, curso);
    }

    updateCourse(curso: Course) {
        return this.http.put(`${this.url}/courses/updateCourse`, curso);
    }

    deleteCourse(id: number) {
        return this.http.delete(`${this.url}/courses/deleteCourse/${id}`);
    }


}
