import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Subject } from 'src/app/models/Subject'
import { Course } from 'src/app/models/Course'
import { Level } from 'src/app/models/Level'

import { CourseService } from 'src/app/services/teacher/course.service'
import { LevelService } from 'src/app/services/teacher/level.service'
import { SubjectService } from 'src/app/services/teacher/subject.service'

import { NOTYF } from 'src/app/services/notyf/notyf.token'
import { Notyf } from 'notyf';

@Component({
    selector: 'app-subject',
    templateUrl: './subject.component.html',
    styleUrls: ['./subject.component.css']
})
export class SubjectsComponent implements OnInit {

    list_subjects: any = []
    list_niveles: any = []
    list_courses: any = []

    notificacion: any = new Notyf({duration: 1500})

    checkboxs: any = []

    subjectAddForm = new FormGroup({
        level: new FormControl(),
        course: new FormControl(),
        name: new FormControl(),
        condition_subject: new FormControl(),
    })

    subjectUpdateForm = new FormGroup({
        id: new FormControl(),
        name_update: new FormControl(),
        condition_subject_update: new FormControl(),
    })

    constructor(
        private subjectService: SubjectService,
        private nivelService: LevelService,
        private courseService: CourseService,
        private formBuilder: FormBuilder,
        @Inject(NOTYF) private notyf: Notyf
    ) { }

    ngOnInit(): void {

        this.subjectAddForm = this.formBuilder.group(
            {
                level: [],
                course: [],
                name: ['', [Validators.required]],
                condition_subject: ['', [Validators.required]],
            })

        this.subjectUpdateForm = this.formBuilder.group(
            {
                id: [''],
                name_update: ['', [Validators.required]],
                condition_subject_update: ['', [Validators.required]],
            })

        this.checkboxLevel()
        this.getSubjects()

    }

    addSubject(subject: Subject) {
        if (!this.subjectAddForm.invalid) {
            this.checkboxs.map((element: any) => {
                element.name = subject.name
                element.condition_subject = subject.condition_subject
            })

            this.subjectService.addSubject(this.checkboxs).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.notificacion.success(res.message)
                        this.subjectAddForm.reset()
                        this.list_courses = []
                        this.checkboxs = []
                        this.getSubjects()
                    } else {
                        this.notificacion.error(res.message)
                    }
                })
        }
    }

    updateSubject(subject: Subject) {
        if (!this.subjectUpdateForm.invalid) {
            this.subjectService.updateSubject(subject).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.notificacion.success(res.message)
                        this.getSubjects()
                    } else {
                        this.notificacion.error(res.message)
                    }
                })
        }
    }

    editSubject(id: number) {

        this.subjectUpdateForm.get('id')?.setValue(id)

        this.subjectService.getIdSubject(id).subscribe((data: any) => {
            this.subjectUpdateForm.patchValue({
                name_update: data[0].name,
                condition_subject_update: '' + data[0].condition_subject + '',
            })
        })
    }


    deleteSubject(id: number) {
        this.subjectService.deleteSubject(id).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.notificacion.success(res.message)
                    this.getSubjects()
                } else {
                    this.notificacion.error(res.message)
                }
            })
    }


    getSubjects() {
        this.subjectService.getSubject().subscribe((subjects) => (this.list_subjects = subjects))
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
        let id = event.target.id

        if (event.target.checked === true) {
            this.courseService.getCourseForLevel(id).subscribe((courses: any) => {
                courses.map((course: Course) => {
                    this.list_courses.push({
                        id: course.id,
                        name: course.name,
                        level: course.level
                    })
                })

                this.subjectAddForm.patchValue({ course: false })
                this.checkboxs = []
            })
        } else {
            this.list_courses = this.list_courses.filter((element: any) => element.level !== parseInt(id))
            this.checkboxs = this.checkboxs.filter((element: any) => element.level !== parseInt(id))
        }
    }

    checkCourses(event: any) {
        let id = event.target.id

        if (event.target.checked === true) {
            this.courseService.getIdCourse(id).subscribe((courses: any) => {
                courses.map((course: Course) => {
                    this.checkboxs.push({
                        course: course.id
                    })
                })
            })
        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.course !== parseInt(id))
        }

    }

    get name() {
        return this.subjectAddForm.get('name')
    }

    get name_update() {
        return this.subjectUpdateForm.get('name_update')
    }

    sortFn = (a: any, b: any): any => {
        if (a.id < b.id) return -1
        if (a.id === b.id) return 0
        if (a.id > b.id) return 1
    }

}
