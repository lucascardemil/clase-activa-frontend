import { Component, DoCheck, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { PlanningComponent } from '../planning.component';
import { PlanningService } from 'src/app/services/admin/planning.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ObjectiveService } from 'src/app/services/admin/objective.service';

@Component({
    selector: 'app-subobjective',
    templateUrl: './subobjective.component.html',
    styleUrls: ['./subobjective.component.css']
})
export class SubobjectiveComponent implements OnInit, DoCheck {

    list_objectives: any = []
    list_objectives_subobjectives: any = []
    checkboxs: any = []
    text_objective: string = ''
    list_preview_subobjectives: any = []
    savedPlanningObjective: any

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    planningAddSubojective = new FormGroup({
        subObjective: new FormControl(),
        objective_unit: new FormControl()
    });

    constructor(
        private objectiveService: ObjectiveService,
        private planningComponent: PlanningComponent,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {

        this.planningAddSubojective = this.formBuilder.group(
            {
                subObjective: ['', [Validators.required]],
                objective_unit: ['', [Validators.required]]
            })
        this.loadObjectives();
    }

    ngDoCheck(): void {

        if (this.objectiveService.savedPlanningObjective !== this.savedPlanningObjective) {
            this.savedPlanningObjective = this.objectiveService.savedPlanningObjective;
            if (this.savedPlanningObjective) {
                this.list_objectives_subobjectives.push(this.savedPlanningObjective);
            }
        }
    }

    savePlanningSubObjective(planning: any) {

        this.checkboxs.map((element: any) => {
            element.subObjective = planning.subObjective
        })

        this.planningService.addPlanningSubObjective(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El OA' + record.name_oa + ' con el subjetivo fue creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El OA' + record.name_oa + ' con el subjetivo ya está creado!');
                });

                await this.planningComponent.loadPlannings();

                this.planningAddSubojective.patchValue({ objective_unit: false });
                this.planningAddSubojective.patchValue({ subObjective: '' });
                this.checkboxs = []
            }
        });
    }

    loadObjectives() {
        this.list_objectives_subobjectives = []
        this.planningService.getIdPlanning('objectives').subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.list_objectives_subobjectives.push({
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

    previewObjectiveSubObjectives(objective: number, name: string) {
        this.text_objective = name
        this.planningService.getIdSubObjective(objective).subscribe((objectives: any) => this.list_preview_subobjectives = objectives)
    }

    disabledButton(planning: any) {
        const result = planning.every((elemento: any) => {
            return Boolean(elemento);
        });

        return !result;
    }

    get subObjective() {
        return this.planningAddSubojective.get('subObjective');
    }

    get objective_unit() {
        return this.planningAddSubojective.get('objective_unit');
    }

}
