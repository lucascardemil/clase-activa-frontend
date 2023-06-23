import { Component, Inject, OnInit } from '@angular/core';
import { PlanningService } from 'src/app/services/admin/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from 'src/app/services/teacher/subject.service';
import { Subject } from 'src/app/models/Subject';
import { AxiService } from 'src/app/services/admin/axi.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
    selector: 'app-axi',
    templateUrl: './axi.component.html',
    styleUrls: ['./axi.component.css']
})
export class AxiComponent implements OnInit {

    list_all_subjects: any = []
    list_axis: any = []

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    planningAddAxi = new FormGroup({
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
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddAxi = this.formBuilder.group(
            {
                subject: ['', [Validators.required]],
                axi: ['', [Validators.required]],
            })

        this.planningUpdateAxi = this.formBuilder.group(
            {
                id: [''],
                update_subject: ['', [Validators.required]],
                update_axi: ['', [Validators.required]],
            })
        this.loadAllSubjects()
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
            subjects.map((subject: Subject) => {
                this.list_all_subjects.push({
                    id: subject.id,
                    name: subject.name,
                    course: subject.course
                })
            })
        })
    }

    savePlanningSubjectAxi(planning: any) {
        this.axiService.addPlaningSubjectAxi(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);
                this.getAxisForTable();

                this.axiService.savePlanningSubjectAxi({
                    id: res.result.id,
                    name: res.result.subject + '/' + res.result.name
                })

            } else {
                this.notyf.error(res.message);
            }
        });
    }

    editAxi(axi: any) {
        this.planningUpdateAxi.get('id')?.setValue(axi.id);
        this.planningUpdateAxi.get('update_axi')?.setValue(axi.name);
        this.editSelected(axi);
    }

    editSelected(axi: any) {
        const selectedSubject = this.list_all_subjects.find((subject: any) => subject.name === axi.subject);
        if (selectedSubject) {
            this.planningUpdateAxi.get('update_subject')?.setValue(selectedSubject.id);
        }
    }

    updatePlanningSubjectAxi(axis: any) {
        this.axiService.updatePlaningSubjectAxi(axis).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.notyf.success(res.message);
                    this.getAxisForTable();

                    this.axiService.savePlanningSubjectAxi({
                        id: res.result.id,
                        name: res.result.subject + '/' + res.result.name
                    })
                    
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

    get update_axi() {
        return this.planningUpdateAxi.get('update_axi');
    }

    get update_subject() {
        return this.planningUpdateAxi.get('update_subject');
    }

}
