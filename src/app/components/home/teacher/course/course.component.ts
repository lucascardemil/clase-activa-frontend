import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Course } from 'src/app/models/Course';
import { Level } from 'src/app/models/Level';
import { CourseService } from 'src/app/services/teacher/course.service';
import { LevelService } from 'src/app/services/teacher/level.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token'
import { Notyf } from 'notyf';

@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

    courses: any = [];
    levels: any = [];

    courseAddForm = new FormGroup({
        level: new FormControl(),
        name: new FormControl(),
        condition: new FormControl(),
    });

    courseUpdateForm = new FormGroup({
        id: new FormControl(),
        level_update: new FormControl(),
        name_update: new FormControl(),
        condition_update: new FormControl(),
    });

    constructor(
        private courseService: CourseService,
        private levelService: LevelService,
        private formBuilder: FormBuilder,
        @Inject(NOTYF) private notyf: Notyf
    ) { }

    ngOnInit(): void {

        this.courseAddForm = this.formBuilder.group(
            {
                level: ['', [Validators.required]],
                name: ['', [Validators.required]],
                condition: ['', [Validators.required]],
            })

        this.courseUpdateForm = this.formBuilder.group(
            {
                id: [''],
                level_update: ['', [Validators.required]],
                name_update: ['', [Validators.required]],
                condition_update: ['', [Validators.required]],
            })

        this.selectLevel();
        this.getCourses();
    }

    addCourse(course: Course) {
        if (!this.courseAddForm.invalid) {
            this.courseService.addCourse(course).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.courseAddForm.reset();
                        this.notyf.success(res.message);
                        this.getCourses();
                    } else {
                        this.notyf.error(res.message);
                    }
                });
        }
    }

    updateCourse(course: Course) {
        if (!this.courseUpdateForm.invalid) {
            this.courseService.updateCourse(course).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.notyf.success(res.message);
                        this.getCourses();
                    } else {
                        this.notyf.error(res.message);
                    }
                });
        }
    }

    editCourse(id: number) {

        this.courseUpdateForm.get('id')?.setValue(id);

        this.courseService.getIdCourse(id).subscribe((data: any) => {
            this.courseUpdateForm.patchValue({
                name_update: data[0].name, 
                condition_update: '' + data[0].condition_course + '',
                level_update: data[0].level 
            });
        })
    }

    deleteCourse(id: number) {
        this.courseService.deleteCourse(id).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.notyf.success(res.message);
                    this.getCourses();
                } else {
                    this.notyf.error(res.message);
                }
            });
    }


    getCourses() {
        this.courseService.getCourse().subscribe((courses) => (this.courses = courses))
    }

    selectLevel(){
        this.levels = [];
        this.levelService.getLevel().subscribe((levels: any) => {
            levels.map((level: Level) => {
                if (level.condition_level === 1) {
                    this.levels.push({
                        id: level.id,
                        name: level.name
                    })
                }
            })
        })
    }

    

    get name() {
        return this.courseAddForm.get('name');
    }

    get level() {
        return this.courseAddForm.get('level');
    }

    get name_update() {
        return this.courseUpdateForm.get('name_update');
    }

    get level_update() {
        return this.courseUpdateForm.get('level_update');
    }

    sortFn = (a: any, b: any): any => {
        if (a.id < b.id) return -1;
        if (a.id === b.id) return 0;
        if (a.id > b.id) return 1;
    }

}
