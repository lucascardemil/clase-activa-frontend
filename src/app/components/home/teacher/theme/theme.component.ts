import { Component, createNgModuleRef, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms'
import { Subject } from 'src/app/models/Subject'
import { Course } from 'src/app/models/Course'
import { Level } from 'src/app/models/Level'

import { CourseService } from 'src/app/services/teacher/course.service'
import { LevelService } from 'src/app/services/teacher/level.service'
import { SubjectService } from 'src/app/services/teacher/subject.service'
import { Theme } from 'src/app/models/Theme'
import { ThemeService } from 'src/app/services/teacher/theme.service'

import { NOTYF } from 'src/app/services/notyf/notyf.token'
import { Notyf } from 'notyf';

@Component({
    selector: 'app-theme',
    templateUrl: './theme.component.html',
    styleUrls: ['./theme.component.css']
})
export class ThemeComponent implements OnInit {

    list_subjects: any = []
    list_niveles: any = []
    list_courses: any = []

    list_themes: any = []


    themeAddForm = new FormGroup({
        level: new FormControl(),
        course: new FormControl(),
        subject: new FormControl(),
        name: new FormControl(),
        condition_theme: new FormControl()
    });

    themeUpdateForm = new FormGroup({
        id: new FormControl(),
        level_update: new FormControl(),
        course_update: new FormControl(),
        subject_update: new FormControl(),
        name_update: new FormControl(),
        condition_theme_update: new FormControl(),
    })

    constructor(
        private subjectService: SubjectService,
        private nivelService: LevelService,
        private courseService: CourseService,
        private themeService: ThemeService,
        private formBuilder: FormBuilder,
        @Inject(NOTYF) private notyf: Notyf
    ) { }

    ngOnInit(): void {

        this.themeAddForm = this.formBuilder.group(
            {
                level: ['', [Validators.required]],
                course: ['', [Validators.required]],
                subject: ['', [Validators.required]],
                name: ['', [Validators.required]],
                condition_theme: ['', [Validators.required]],
            })

        this.themeUpdateForm = this.formBuilder.group(
            {
                id: [''],
                level_update: ['', [Validators.required]],
                course_update: ['', [Validators.required]],
                subject_update: ['', [Validators.required]],
                name_update: ['', [Validators.required]],
                condition_theme_update: ['', [Validators.required]],
            })

        this.checkboxLevel()
        this.getThemes()
    }

    addTheme(theme: Theme) {
        if (!this.themeAddForm.invalid) {

            this.themeService.addTheme(theme).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.notyf.success(res.message)
                        this.themeAddForm.reset()
                        this.getThemes()
                    } else {
                        this.notyf.error(res.message)
                    }
                })
        }
    }

    updateTheme(theme: Theme) {
        if (!this.themeUpdateForm.invalid) {
            this.themeService.updateTheme(theme).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.notyf.success(res.message)
                        this.getThemes()
                    } else {
                        this.notyf.error(res.message)
                    }
                })
        }
    }

    editTheme(id: number) {

        this.themeUpdateForm.get('id')?.setValue(id)

        this.themeService.getIdTheme(id).subscribe((data: any) => {
            this.themeUpdateForm.patchValue({
                level_update: data[0].level_id,
                course_update: data[0].course_id,
                subject_update: data[0].subject_id,
                name_update: data[0].name,
                condition_theme_update: '' + data[0].condition_theme + '',
            })

            this.courseService.getCourseForLevel(data[0].level_id).subscribe((courses: any) => {
                courses.map((course: Course) => {
                    this.list_courses.push({
                        id: course.id,
                        name: course.name
                    })
                })
            })

            this.subjectService.getSubjectForCourse(data[0].course_id).subscribe((subjects: any) => {
                subjects.map((subject: Subject) => {
                    this.list_subjects.push({
                        id: subject.id,
                        name: subject.name
                    })
                })
            })
        })
    }


    deleteTheme(id: number) {
        this.themeService.deleteTheme(id).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.notyf.success(res.message)
                    this.getThemes()
                } else {
                    this.notyf.error(res.message)
                }
            })
    }


    getThemes() {
        this.themeService.getTheme().subscribe((themes) => (this.list_themes = themes))
    }



    checkboxLevel() {
        this.list_niveles = []
        this.subjectService.getAllLevelsWithoutCourses().subscribe((niveles: any) => {
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


    get name() {
        return this.themeAddForm.get('name')
    }

    get level() {
        return this.themeAddForm.get('level');
    }

    get course() {
        return this.themeAddForm.get('course');
    }

    get subject() {
        return this.themeAddForm.get('subject');
    }

    get name_update() {
        return this.themeUpdateForm.get('name_update')
    }

    get level_update() {
        return this.themeUpdateForm.get('level_update');
    }

    get course_update() {
        return this.themeUpdateForm.get('course_update');
    }

    get subject_update() {
        return this.themeUpdateForm.get('subject_update');
    }

    sortFn = (a: any, b: any): any => {
        if (a.id < b.id) return -1
        if (a.id === b.id) return 0
        if (a.id > b.id) return 1
    }
}
