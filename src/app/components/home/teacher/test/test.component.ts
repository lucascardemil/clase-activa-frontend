import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/models/Course';
import { Level } from 'src/app/models/Level';
import { Subject } from 'src/app/models/Subject';
import { Test } from 'src/app/models/Test';
import { AddTestService } from 'src/app/services/teacher/add-test.service';
import { CourseService } from 'src/app/services/teacher/course.service';
import { LevelService } from 'src/app/services/teacher/level.service';
import { SubjectService } from 'src/app/services/teacher/subject.service';
import { ThemeService } from 'src/app/services/teacher/theme.service';
import { UserService } from 'src/app/services/user/user.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token'
import { Notyf } from 'notyf';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

    list_subjects: any = []
    list_niveles: any = []
    list_courses: any = []

    test: any = [{subject: '559'}]



    testAddForm = new FormGroup({
        level: new FormControl(),
        course: new FormControl(),
        subject: new FormControl(),
        name: new FormControl(),
        percentage: new FormControl(),
        standard: new FormControl(),
        instruction: new FormControl(),
        objective: new FormControl()
    });

    constructor(
        private subjectService: SubjectService,
        private nivelService: LevelService,
        private courseService: CourseService,
        private themeService: ThemeService,
        private testService: AddTestService,
        private formBuilder: FormBuilder,
        @Inject(NOTYF) private notyf: Notyf,
        public userService: UserService,
    ) { }

    ngOnInit(): void {

        this.testAddForm = this.formBuilder.group(
            {
                level: ['', [Validators.required]],
                course: ['', [Validators.required]],
                subject: ['', [Validators.required]],
                name: ['', [Validators.required]],
                percentage: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(100)]],
                standard: [''],
                instruction: [''],
                objective: [''],
                existTheme: [false, [Validators.requiredTrue]],
                user: this.userService.getUserlogged('id')
            })

        this.checkboxLevel();

    }

    addTest(test: Test) {
        if (!this.testAddForm.invalid) {

            this.testService.addTest(test).subscribe((res: any) => {
                if (res.status === 'success') {
                    this.notyf.success(res.message);
                    this.testAddForm.reset()
                    this.test.push({
                        id_test: res.test.id,
                        selected_standard: res.test.standard,
                        name_test: res.test.name,
                        percentage: res.test.percentage,
                        subject: res.test.subject
                    })
                } else {
                    this.notyf.error(res.message)
                }
            })
        }
    }

    checkboxLevel() {
        this.list_niveles = []
        this.nivelService.getLevel().subscribe((niveles: any) => {
            niveles.map((nivel: Level) => {
                if (nivel.condition_level === 1) {
                    this.list_niveles.push({
                        id: nivel.id,
                        name: nivel.name
                    })
                }
            })
        })
    }

    loadCourses(event: any) {
        this.list_courses = []
        let id = event.target.value
        this.courseService.getCourseForLevel(id).subscribe((courses: any) => {
            courses.map((course: Course) => {
                this.list_courses.push({
                    id: course.id,
                    name: course.name
                })
            })
        })
    }

    loadSubject(event: any) {
        this.list_subjects = []
        let id = event.target.value
        this.subjectService.getSubjectForCourse(id).subscribe((subjects: any) => {
            subjects.map((subject: Subject) => {
                this.list_subjects.push({
                    id: subject.id,
                    name: subject.name
                })
            })
        })
    }

    loadTheme(event: any) {
        let id = event.target.value
        this.themeService.getThemeForSubject(id).subscribe((themes: any) => {
            if (themes.length > 0) {
                this.notyf.success('¡La asignatura si tiene materias asociadas!');
                this.testAddForm.get('existTheme')?.patchValue(true)
            } else {
                this.notyf.error('¡La asignatura no tiene materias asociadas, seleccione otra asignatura!');
                this.testAddForm.get('existTheme')?.patchValue(false)
            }
        })
    }

    get name() {
        return this.testAddForm.get('name')
    }

    get percentage() {
        return this.testAddForm.get('percentage')
    }

    get level() {
        return this.testAddForm.get('level');
    }

    get course() {
        return this.testAddForm.get('course');
    }

    get subject() {
        return this.testAddForm.get('subject');
    }

}
