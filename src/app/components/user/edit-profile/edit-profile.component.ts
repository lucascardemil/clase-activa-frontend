import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Course } from 'src/app/models/Course';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user/user.service';
import { RutService } from 'src/app/services/user/rut.service';
import { CourseService } from 'src/app/services/teacher/course.service';
import { LevelService } from 'src/app/services/teacher/level.service';
import { SubjectService } from 'src/app/services/teacher/subject.service';
import { Router } from '@angular/router';
import { Level } from 'src/app/models/Level';
import { Subject } from 'src/app/models/Subject';
import { UserEducationService } from 'src/app/services/user/user_education.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token'
import { Notyf } from 'notyf';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

    list_subjects: any = []
    list_levels: any = []
    list_courses: any = []

    checkboxs: any = []
    checkboxs_delete: any = []

    images: any = []

    selectedFile: any = File;

    msjPassword: any;


    updateUserFormPerson = new FormGroup({
        id: new FormControl(),
        name: new FormControl(),
        last_name: new FormControl(),
        mothers_last_name: new FormControl(),
        email: new FormControl(),
        telefono: new FormControl(),
    })

    changePasswordUser = new FormGroup({
        id: new FormControl(),
        password: new FormControl(),
        repeatpassword: new FormControl(),
    })



    updateUserFormEducation = new FormGroup({
        id: new FormControl()
    })

    updateUserFormSchool = new FormGroup({
        id: new FormControl(),
        school: new FormControl(),
        image: new FormControl(),
    })


    constructor(
        public userService: UserService,
        public userEducationService: UserEducationService,
        public rutService: RutService,
        private formBuilder: FormBuilder,
        private router: Router,
        private subjectService: SubjectService,
        private levelService: LevelService,
        private courseService: CourseService,
        @Inject(NOTYF) private notyf: Notyf
    ) { }


    ngOnInit(): void {

        this.updateUserFormPerson = this.formBuilder.group(
            {
                id: [''],
                name: ['', [Validators.required]],
                last_name: ['', [Validators.required]],
                mothers_last_name: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                telefono: ['', [Validators.required, Validators.maxLength(8), Validators.pattern(/^([0-9])*$/)]]
            })

        this.changePasswordUser = this.formBuilder.group(
            {
                id: [''],
                password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8)]],
                repeatpassword: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(8)]]
            })

        this.updateUserFormEducation = this.formBuilder.group(
            {
                id: [''],
            })

        this.updateUserFormSchool = this.formBuilder.group(
            {
                id: [''],
                school: ['', [Validators.required]],
                image: ['', [Validators.required]],
            })

        this.editProfile()
        this.checkboxLevel()
        this.getSchoolUser()
    }

    updateInfoPerson(user: User) {
        if (!this.updateUserFormPerson.invalid) {
            this.userService.updateInfoPerson(user).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.notyf.success(res.message);
                        setInterval(() => {
                            this.userService.logout();
                        }, 3000)

                    } else {
                        this.notyf.error(res.message);
                    }
                });
        }
    }


    changePassword(user: User) {
        if (!this.changePasswordUser.invalid) {
            this.userService.changePasswordUser(user).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.notyf.success(res.message);
                        this.changePasswordUser.reset();
                        this.userService.logout();
                    } else {
                        this.notyf.error(res.message);
                    }
                });
        }
    }

    updateInfoEducation(user: User) {
        if (this.checkboxs.length > 0) {
            this.checkboxs.map((element: any) => {
                element.id_user = user.id
            })

            this.userEducationService.updateInfoEducation([this.checkboxs, this.checkboxs_delete]).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.notyf.success(res.message)
                        this.list_courses = []
                        this.list_subjects = []
                        this.checkboxs = []
                        // this.checkboxs_delete = []
                        this.editProfile()
                    } else {
                        this.notyf.error(res.message)
                    }
                })

        } else {
            this.notyf.error('Seleccione una asignatura para actualizar')
        }

    }

    confirmPassword(event: any) {
        const repeatpassword = event.target.value;
        const password = this.password?.value;

        if (repeatpassword !== password) {
            this.msjPassword = false;
        } else {
            this.msjPassword = true;
        }

    }

    checkboxLevel() {
        this.list_levels = []
        this.subjectService.getAllLevelsWithoutCourses().subscribe((levels: any) => {
            levels.map((level: Level) => {
                if (level.condition_level === 1) {
                    this.list_levels.push({
                        id: level.id,
                        name: level.name
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

                this.updateUserFormEducation.patchValue({ course: false })
                this.checkboxs = []
            })
            this.checkboxs_delete = this.checkboxs_delete.filter((element: any) => element.id_level === parseInt(id))
        } else {

            this.list_courses.map((course: any) => {
                if (course.level === parseInt(id)) {
                    this.list_subjects = this.list_subjects.filter((element: any) => element.course !== course.id)
                }
            })

            this.list_courses = this.list_courses.filter((element: any) => element.level !== parseInt(id))

            this.list_subjects.map((subject: any) => {
                this.checkboxs = this.checkboxs.filter((element: any) => element.id !== subject.id)
            })
            this.checkboxs_delete.push({ level: id })
        }
    }

    loadSubjects(event: any) {
        let id = event.target.id

        if (event.target.checked === true) {
            this.subjectService.getSubjectForCourse(id).subscribe((subjects: any) => {
                subjects.map((subject: Subject) => {
                    this.list_subjects.push({
                        id: subject.id,
                        name: subject.name,
                        course: subject.course
                    })
                })

                this.updateUserFormEducation.patchValue({ subject: false })
                this.checkboxs = []
            })
            this.checkboxs_delete = this.checkboxs_delete.filter((element: any) => element.id_course === parseInt(id))
        } else {
            this.list_subjects.map((subject: any) => {
                this.checkboxs = this.checkboxs.filter((element: any) => element.id !== subject.id)
            })

            this.list_subjects = this.list_subjects.filter((element: any) => element.course !== parseInt(id))
            this.checkboxs_delete.push({ course: id })
        }
    }

    checkBoxs(event: any) {
        let id = event.target.id
        this.checkboxs = this.checkboxs.filter((element: any) => element.id !== parseInt(id))

        if (event.target.checked === true) {
            this.checkboxs.push({ id: parseInt(id) })
            this.checkboxs_delete = this.checkboxs_delete.filter((element: any) => element.id_subject === parseInt(id))
        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== parseInt(id))
            this.checkboxs_delete.push({ subject: id })
        }
    }

    uploadImage(element: any) {
        this.selectedFile = element.target.files;
    }

    uploadImageUser(user: User) {
        this.images = []
        if (!this.updateUserFormSchool.invalid) {
            const formData = new FormData();
            for (var i = 0; i < this.selectedFile.length; i++) {
                formData.append("uploads[]", this.selectedFile[i], this.selectedFile[i].name);
            }

            const users = [{
                id: user.id,
                school: user.school
            }]

            formData.append("users", JSON.stringify(users))

            this.userEducationService.updateImageSchool(formData).subscribe((res: any) => {
                if (res.status === 'success') {

                    this.notyf.success(res.message)

                    this.images.push(this.imagePath(res.school.image))

                } else {
                    this.notyf.error(res.message)
                }
            })
        }
    }

    getSchoolUser() {
        this.userEducationService.getSchoolUser(this.userService.getUserlogged('id')).subscribe((images: any) => {
            images.map((image: any) => {
                this.images.push(this.imagePath(image.image))
            })
        })
    }


    editProfile() {
        this.checkboxs = []

        this.userEducationService.getSchoolUser(this.userService.getUserlogged('id')).subscribe((educations: any) => {
            educations.map((education: any) => {
                this.updateUserFormSchool.patchValue({ school: education.school })
            })
        })

        this.userService.getUserId(this.userService.getUserlogged('id')).subscribe((users: any) => {
            users.rows.map((row: any) => {
                this.updateUserFormPerson.patchValue({
                    id: row.id,
                    name: row.name,
                    last_name: row.last_name,
                    mothers_last_name: row.mothers_last_name,
                    email: row.email,
                    telefono: row.telefono
                })

                this.changePasswordUser.patchValue({
                    id: row.id,
                })

                this.updateUserFormSchool.patchValue({
                    id: row.id,
                })

                this.userEducationService.getUserEducationLevel(row.id).subscribe((user_levels: any) => {
                    const user_level = user_levels.map((user_level: any) => user_level.id);
                    const levels = this.list_levels.filter((list_level: any) => user_level.includes(list_level.id));

                    levels.map((level: any) => {
                        const list_levels = document.getElementById(level.id) as HTMLInputElement
                        list_levels.checked = true

                        this.courseService.getCourseForLevel(level.id).subscribe((courses: any) => {
                            this.userEducationService.getUserEducationCourse(row.id).subscribe((user_courses: any) => {

                                const user_course = user_courses.map((user_course: any) => user_course.id);
                                const result_courses = courses.filter((list_course: any) => !user_course.includes(list_course.id));

                                result_courses.map((result_course: any) => {
                                    this.list_courses.push({
                                        id: result_course.id,
                                        name: result_course.name,
                                        level: result_course.level,
                                    })
                                })

                                const user_course_check = user_courses.map((user_course: any) => user_course.id);
                                const result_courses_check = courses.filter((list_course: any) => user_course_check.includes(list_course.id));


                                result_courses_check.map((result_course_check: any) => {
                                    this.list_courses.push({
                                        id: result_course_check.id,
                                        name: result_course_check.name,
                                        level: result_course_check.level,
                                        checked: true,
                                    })




                                    this.subjectService.getSubjectForCourse(result_course_check.id).subscribe((subjects: any) => {
                                        this.userEducationService.getUserEducation(row.id).subscribe((user_subjects: any) => {

                                            subjects.map((subject: any) => {
                                                user_subjects.map((user_subject: any) => {
                                                    if (subject.id === user_subject.id) {
                                                        this.list_subjects.push({
                                                            id: subject.id,
                                                            name: subject.name,
                                                            course: subject.course,
                                                            checked: true,
                                                        })
                                                    }
                                                })
                                            })

                                            const user_subject = user_subjects.map((user_subject: any) => user_subject.id);
                                            const result_subjects = subjects.filter((list_subject: any) => !user_subject.includes(list_subject.id));

                                            result_subjects.map((result_subject: any) => {
                                                this.list_subjects.push({
                                                    id: result_subject.id,
                                                    name: result_subject.name,
                                                    course: result_subject.course,
                                                });
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
        this.checkboxs = this.list_subjects
    }

    imagePath(image: any){
        let image_format = image.replace(/\\/g, '/')
        return image_format.slice(image_format.indexOf('assets'))
    }


    get id() {
        return this.updateUserFormPerson.get('id');
    }

    get name() {
        return this.updateUserFormPerson.get('name');
    }

    get last_name() {
        return this.updateUserFormPerson.get('last_name');
    }
    get mothers_last_name() {
        return this.updateUserFormPerson.get('mothers_last_name');
    }

    get email() {
        return this.updateUserFormPerson.get('email');
    }

    get telefono() {
        return this.updateUserFormPerson.get('telefono');
    }

    get password() {
        return this.changePasswordUser.get('password');
    }

    get repeatpassword() {
        return this.changePasswordUser.get('repeatpassword');
    }

    get id_user_school() {
        return this.updateUserFormSchool.get('id');
    }

    get school() {
        return this.updateUserFormSchool.get('school');
    }



}
