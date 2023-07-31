import { Component, Inject, OnInit } from '@angular/core';
import { PlanningService } from 'src/app/services/admin/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
        update_course: new FormControl(),
        update_subject: new FormControl(),
        update_axi: new FormControl(),
    });

    constructor(
        private planningComponent: PlanningComponent,
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
                id: [''],
                update_course: ['', [Validators.required]],
                update_subject: ['', [Validators.required]],
                update_axi: ['', [Validators.required]],
            })
        this.loadAllSubjects()
        this.loadAllUpdateSubjects()
        this.getAxisForTable()
    }

    getAxisForTable() {
        this.axiService.getSelectAxis().subscribe((axis) => {
            this.list_axis = axis;
            this.calculatePagedItems();
        });
    }

    loadAllSubjects() {
        this.list_all_subjects = []
        this.subjectService.getSubject().subscribe((subjects: any) => {
            const uniqueNames: any = {};
            this.list_all_subjects = subjects.filter((obj:any) => {
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
            subjects.map((subject: any) =>{
                this.list_all_update_subjects.push({
                    id: subject.id,
                    name: subject.name,
                    course: subject.course
                })
            })
        })
    }

    searchCourse(event: any) {
        let id = event.target.value
        this.list_all_courses = []
        this.checkboxs = []
        this.planningAddAxi.patchValue({ course: false });
        this.courseService.getCourseForSubject(id).subscribe((courses: any) => {
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
                id: id
            })
        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== id)
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

    editAxi(axi: any) {
        this.planningUpdateAxi.get('id')?.setValue(axi.id);
        this.planningUpdateAxi.get('update_axi')?.setValue(axi.name);
        this.editSelected(axi);
    }

    editSelected(axi: any) {
        const selectedSubject = this.list_all_update_subjects.find((subject: any) => subject.name === axi.subject && subject.course === axi.course);
        if (selectedSubject) {
            this.planningUpdateAxi.get('update_subject')?.setValue(selectedSubject.id);
        }
    }

    updatePlanningSubjectAxi(axis: any) {
        this.axiService.updatePlaningSubjectAxi(axis).subscribe(
            async (res: any) => {
                if (res.status === 'success') {
                    this.notyf.success(res.message);
                    this.getAxisForTable();

                    this.axiService.savePlanningSubjectAxi({
                        id: res.result.id,
                        name: res.result.subject + '/' + res.result.name
                    })

                    await this.planningComponent.loadPlannings();

                } else {
                    this.notyf.error(res.message);
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
