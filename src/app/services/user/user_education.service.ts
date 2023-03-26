import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User } from '../../models/User';

@Injectable({
    providedIn: 'root'
})
export class UserEducationService {

    private url = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }


    getUserEducationLevel(id: number) {
        return this.http.get(`${this.url}/users_educations/getUserEducationLevel/${id}`);
    }

    getUserEducationCourse(id: number) {
        return this.http.get(`${this.url}/users_educations/getUserEducationCourse/${id}`);
    }

    getUserEducation(id: number) {
        return this.http.get(`${this.url}/users_educations/getUserEducation/${id}`);
    }

    getSchoolUser(id: any) {
        return this.http.get(`${this.url}/users_educations/getSchoolUser/${id}`);
    }

    updateInfoEducation(checkboxs: any) {
        return this.http.post(`${this.url}/users_educations/updateInfoEducation`, checkboxs);
    }

    deleteInfoEducation(user: User) {
        return this.http.post(`${this.url}/users_educations/deleteInfoEducation/`, user);
    }

    updateImageSchool(image: any) { 
        return this.http.post(`${this.url}/users_educations/updateImageSchool/`, image);
    }

}


