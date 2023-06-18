import { Component, DoCheck, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/services/teacher/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { PlanningComponent } from '../planning.component';
import { AxiService } from 'src/app/services/teacher/axi.service';
import { ObjectiveService } from 'src/app/services/teacher/objective.service';

@Component({
    selector: 'app-axi-objective',
    templateUrl: './axi-objective.component.html',
    styleUrls: ['./axi-objective.component.css']
})
export class AxiObjectiveComponent implements OnInit, DoCheck {

    select_axis: any = []
    list_objectives: any = []
    list_objectives_axis: any = []
    checkboxs: any = []
    text_objective: string = ''
    savedPlanningSubjectAxi: any;
    savedPlanningObjective: any;

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    planningAddAxiObjective = new FormGroup({
        select_axi: new FormControl(),
        objective_axi: new FormControl(),
    });


    constructor(
        private objectiveService: ObjectiveService,
        private axiService: AxiService,
        private planningComponent: PlanningComponent,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddAxiObjective = this.formBuilder.group(
            {
                select_axi: ['', [Validators.required]],
                objective_axi: [],
            })

        this.selectAxis()
        this.loadObjectives()
    }

    ngDoCheck(): void {
        if (this.axiService.savedPlanningSubjectAxi !== this.savedPlanningSubjectAxi) {
            this.savedPlanningSubjectAxi = this.axiService.savedPlanningSubjectAxi;
            if (this.savedPlanningSubjectAxi) {
                this.select_axis.push(this.savedPlanningSubjectAxi);
            }
        }

        if (this.objectiveService.savedPlanningObjective !== this.savedPlanningObjective) {
            this.savedPlanningObjective = this.objectiveService.savedPlanningObjective;
            if (this.savedPlanningObjective) {
                this.list_objectives_axis.push(this.savedPlanningObjective);
            }
        }
    }

    savePlanningAxiObjective(planning: any) {

        this.checkboxs.map((element: any) => {
            element.axi = this.listAxis(planning.axi)
        })

        this.planningService.addPlanningAxiObjective(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');

                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                await this.planningComponent.loadPlannings();

                this.planningAddAxiObjective.patchValue({ objective_axi: false });
                this.planningAddAxiObjective.patchValue({ select_axi: '' });
                this.checkboxs = []
            }
        });
    }

    selectAxis() {
        this.select_axis = []
        this.planningService.getSelectAxis().subscribe((axis: any) => {
            axis.map((axi: any) => {
                this.select_axis.push({
                    id: axi.id,
                    name: axi.subject + '/' + axi.name
                })
            })
        })
    }

    loadObjectives() {
        this.list_objectives_axis = []
        this.planningService.getIdPlanning('objectives').subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.list_objectives_axis.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name
                })
            })
        })
    }

    onScroll(event: any) {
        const maxScrollTop = event.target.scrollHeight - event.target.clientHeight;
        let scrollTop = event.target.scrollTop;
        this.stickyElements.forEach(stickyElement => {
            stickyElement.nativeElement.style.top = `${Math.min(scrollTop, maxScrollTop)}px`;
        });
    }


    checkBox(event: any) {
        let id = event.target.id

        if (event.target.checked === true) {
            this.checkboxs.push({
                id: id
            })

        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== id)
            this.text_objective = ''
        }

    }

    previewObjective(name: string) {
        this.text_objective = name
    }

    disabledButton(planning: any) {
        const result = planning.every((elemento: any) => {
            return Boolean(elemento);
        });

        return !result;
    }

    listAxis(name: any) {
        let list = this.select_axis.filter((x: any) => x.name === name)[0];
        return list.id;
    }

    get select_axi() {
        return this.planningAddAxiObjective.get('select_axi');
    }

    get objective_axi() {
        return this.planningAddAxiObjective.get('objective_axi');
    }

}
