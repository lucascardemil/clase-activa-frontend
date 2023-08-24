import { Component, Inject, OnInit } from '@angular/core';
import { PlanningService } from 'src/app/services/admin/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from 'src/app/services/teacher/subject.service';
import { AxiService } from 'src/app/services/admin/axi.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { PlanningComponent } from '../planning/planning.component';
import { CourseService } from 'src/app/services/teacher/course.service';


@Component({
    selector: 'app-axi',
    templateUrl: './axi.component.html',
    styleUrls: ['./axi.component.css']
})
export class AxiComponent implements OnInit {

    list_all_subjects: any = []
    list_all_update_subjects: any = []
    list_all_courses: any = []
    list_all_update_courses: any = []
    list_axis: any = []
    checkboxs: any = []

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    planningAddAxi = new FormGroup({
        course: new FormControl(),
        subject: new FormControl(),
        axi: new FormControl(),
    });

    planningUpdateAxi = new FormGroup({
        update_subject: new FormControl(),
        update_axi: new FormControl(),
    });

    constructor(
        public resourcesService: ResourcesService,
        private axiService: AxiService,
        private subjectService: SubjectService,
        private courseService: CourseService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddAxi = this.formBuilder.group(
            {
                course: ['', [Validators.required]],
                subject: ['', [Validators.required]],
                axi: ['', [Validators.required]],
            })

        this.planningUpdateAxi = this.formBuilder.group(
            {
                
                update_subject: ['', [Validators.required]],
                update_axi: ['', [Validators.required]],
            })

        this.loadAllSubjects()
        this.loadAllUpdateSubjects()
        this.getAxisForTable()
    }

    editAxi(data: any) {
        this.planningUpdateAxi.get('update_subject')?.setValue(data.subject);
        this.planningUpdateAxi.get('update_axi')?.setValue(data.axi);
        this.loadAllCourses(data);
    }


    editSelected(axi: any) {
        const selectedSubject = this.list_all_update_subjects.find((subject: any) => subject.name === axi.subject);
        if (selectedSubject) {
            this.planningUpdateAxi.get('update_subject')?.setValue(selectedSubject.id);
        }
    }

    getAxisForTable() {
        this.axiService.getSelectAxis().subscribe((axis) => {
            this.list_axis = this.groupObjectivesTable(axis);
            this.calculatePagedItems();
        });
    }

    loadAllSubjects() {
        this.list_all_subjects = []
        this.subjectService.getSubject().subscribe((subjects: any) => {
            const uniqueNames: any = {};
            this.list_all_subjects = subjects.filter((obj: any) => {
                if (!uniqueNames[obj.name]) {
                    uniqueNames[obj.name] = true;
                    return true;
                }
                return false;
            });
        })
    }

    loadAllUpdateSubjects() {
        this.list_all_update_subjects = []
        this.subjectService.getSubject().subscribe((subjects: any) => {
            const uniqueNames: any = {};
            this.list_all_update_subjects = subjects.filter((obj: any) => {
                if (!uniqueNames[obj.name]) {
                    uniqueNames[obj.name] = true;
                    return true;
                }
                return false;
            });
        })
    }

    loadAllCourses(data: any) {
        this.list_all_update_courses = [];
        this.checkboxs = [];

        this.courseService.getCourseForSubjectName(data.subject).subscribe((courses: any) => {
            courses.map((course: any) => {
                this.list_all_update_courses.push({
                    id: course.id,
                    name: course.name,
                    checked: false
                })

                this.planningUpdateAxi.addControl(`update_course_${course.id}`, new FormControl(false, Validators.required));
            })

            for (let course of data.courses) {
                let edit_select = this.list_all_update_courses.find((item: any) => item.id === course.id);
                if (edit_select) {
                    edit_select.checked = true;
                    this.planningUpdateAxi.get(`update_course_${edit_select.id}`)?.patchValue(true);

                    this.checkboxs.push({
                        id: edit_select.id,
                        checked: edit_select.checked
                    })
                }
            }

            for (let course of this.list_all_update_courses) {
                let edit_deselect = data.courses.find((item: any) => item.id === course.id);
                if (!edit_deselect) {
                    course.checked = false;
                    this.planningUpdateAxi.get(`update_course_${course.id}`)?.patchValue(false);
                }
            }
        })
    }

    searchCourse(event: any) {
        let id = event.target.value
        this.list_all_courses = []
        this.checkboxs = []
        this.planningAddAxi.patchValue({ course: false });
        this.courseService.getCourseForSubjectName(id).subscribe((courses: any) => {
            courses.map((course: any) => {
                this.list_all_courses.push({
                    id: course.id,
                    name: course.name
                })
            })
        })
    }

    checkBox(event: any) {
        let id = parseInt(event.target.id)

        if (event.target.checked === true) {
            this.checkboxs.push({
                id: id,
                checked: true
            })

            let selected = this.list_all_update_courses.find((item: any) => item.id === id);
            if (selected) {
                selected.checked = true;
            }

        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== id)

            let deselect = this.list_all_update_courses.find((item: any) => item.id === id);
            if (deselect) {
                deselect.checked = false;
                this.checkboxs.push({
                    id: deselect.id,
                    checked: deselect.checked
                })
            }
        }
    }



    savePlanningSubjectAxi(planning: any) {
        this.checkboxs.map((element: any) => {
            element.axi = planning.axi,
                element.subject = planning.subject
        })

        this.axiService.addPlaningSubjectAxi(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El Eje ' + record.name + ' y la Asignatura ' + record.subject + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El Eje' + record.name + ' y la Asignatura ' + record.subject + ' ya están asociados!');
                });

                this.axiService.savePlanningSubjectAxi(insertedRecords)

                this.clearForm();
                this.getAxisForTable();
                this.planningAddAxi.patchValue({ course: false });
                this.checkboxs = []
            }
        });
    }

    updatePlanningSubjectAxi(planning: any) {
        this.checkboxs.map((element: any) => {
            element.axi = planning.axi,
                element.subject = planning.subject
        })

        this.axiService.addPlaningSubjectAxi(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords, deleteRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El Eje ' + record.name + ' y el Curso ' + record.course + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El Eje ' + record.name + ' y el Curso ' + record.course + ' ya están asociados!');
                });

                deleteRecords.forEach((record: any) => {
                    this.notyf.success('¡El Curso ' + record.course + ' fue eliminado!');
                });

                this.axiService.savePlanningSubjectAxi(insertedRecords)

                this.getAxisForTable();
                this.planningUpdateAxi.patchValue({ update_course: false });
                this.checkboxs = []
            }
        });
    }

    clearForm() {
        this.subject?.setValue('');
        this.axi?.setValue('');
    }

    get totalPages(): number {
        return Math.ceil(this.list_axis.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.list_axis.slice(startIndex, endIndex);
    }

    pageChanged(pageNumber: number) {
        this.currentPage = pageNumber;
        this.calculatePagedItems();
    }

    groupObjectivesTable(data: any) {
        const result: any[] = [];

        data.forEach((item: any) => {
            const axi = item.name;
            const subject = item.subject;

            // Buscar si ya existe un objeto con el mismo axi en el resultado
            const existingAxi = result.find(obj => obj.axi === axi);

            if (!existingAxi) {
                result.push({
                    subject: subject,
                    courses: [{ id: item.id_course, name: item.course }],
                    axi: axi
                });
            } else {
                // Si ya existe el axi, verificar si el curso ya está en la lista de cursos
                const existingCourse = existingAxi.courses.find((course: any) => course.id_course === item.id_course);

                if (!existingCourse) {
                    existingAxi.courses.push({ id: item.id_course, name: item.course });
                }
            }
        });

        return result;
    }

    get axi() {
        return this.planningAddAxi.get('axi');
    }

    get subject() {
        return this.planningAddAxi.get('subject');
    }

    get course() {
        return this.planningAddAxi.get('course');
    }

    get update_axi() {
        return this.planningUpdateAxi.get('update_axi');
    }

    get update_subject() {
        return this.planningUpdateAxi.get('update_subject');
    }

    get update_course() {
        return this.planningUpdateAxi.get('update_course');
    }

}
