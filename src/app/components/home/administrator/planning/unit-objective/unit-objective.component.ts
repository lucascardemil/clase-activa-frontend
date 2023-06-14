import { Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PlanningComponent } from '../planning.component';
import { PlanningService } from 'src/app/services/teacher/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-unit-objective',
    templateUrl: './unit-objective.component.html',
    styleUrls: ['./unit-objective.component.css']
})
export class UnitObjectiveComponent implements OnInit {

    select_units: any = []
    list_objectives: any = []
    list_objectives_units: any = []
    checkboxs: any = []
    text_objective: string = ''

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    planningAddUnitObjective = new FormGroup({
        select_unit: new FormControl(),
        objective_unit: new FormControl()
    });

    constructor(
        private planningComponent: PlanningComponent,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {

        this.planningAddUnitObjective = this.formBuilder.group(
            {
                objective_unit: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
            })
        this.selectUnits()
        this.loadObjectives()
    }

    savePlanningUnitObjective(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.listUnits(planning.unit)
        })

        this.planningService.addPlanningUnitObjective(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                await this.planningComponent.loadPlannings();

                this.planningAddUnitObjective.patchValue({ objective_unit: false });
                this.planningAddUnitObjective.patchValue({ select_unit: '' });
                this.checkboxs = []
            }
        });
    }

    selectUnits() {
        this.select_units = []
        this.planningService.getSelectUnits().subscribe((units: any) => {
            units.map((unit: any) => {
                this.select_units.push({
                    id: unit.id,
                    name: unit.level + '/' + unit.course + '/' + unit.subject + '/' + unit.unit
                })
            })
        })
    }

    loadObjectives() {
        this.list_objectives_units = []
        this.planningService.getIdPlanning('objectives').subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.list_objectives_units.push({
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

    listUnits(name: any) {
        let list = this.select_units.filter((x: any) => x.name === name)[0];
        return list.id;
    }


    get select_unit() {
        return this.planningAddUnitObjective.get('select_unit');
    }
    
    get objective_unit() {
        return this.planningAddUnitObjective.get('objective_unit');
    }
}
