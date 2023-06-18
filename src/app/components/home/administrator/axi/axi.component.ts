import { Component, Inject, OnInit } from '@angular/core';
import { PlanningService } from 'src/app/services/teacher/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from 'src/app/services/teacher/subject.service';
import { Subject } from 'src/app/models/Subject';
import { AxiService } from 'src/app/services/teacher/axi.service';

@Component({
    selector: 'app-axi',
    templateUrl: './axi.component.html',
    styleUrls: ['./axi.component.css']
})
export class AxiComponent implements OnInit {

    list_all_subjects: any = []

    planningAddAxi = new FormGroup({
        subject: new FormControl(),
        axi: new FormControl(),
    });

    constructor(
        private axiService: AxiService,
        private subjectService: SubjectService,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddAxi = this.formBuilder.group(
            {
                subject: ['', [Validators.required]],
                axi: ['', [Validators.required]],
            })
        this.loadAllSubjects()
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
        this.planningService.addPlaningSubjectAxi(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);

                this.planningService.getIdAxisSubjects(res.result.name, res.result.subject).subscribe((axis: any) => {
                    axis.map((axi: any) => {
                        this.axiService.savePlanningSubjectAxi({
                            id: axi.id,
                            name: axi.subject + '/' + axi.name
                        })
                    })
                })

            } else {
                this.notyf.error(res.message);
            }
        });
    }

    disabledButton(planning: any) {
        const result = planning.every((elemento: any) => {
            return Boolean(elemento);
        });

        return !result;
    }

    clearForm() {
        this.subject?.setValue('');
        this.axi?.setValue('');
    }

    get axi() {
        return this.planningAddAxi.get('axi');
    }

    get subject() {
        return this.planningAddAxi.get('subject');
    }

}
