import { Component, DoCheck, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PlanningComponent } from '../planning.component';
import { PlanningService } from 'src/app/services/teacher/planning.service';


import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitService } from 'src/app/services/teacher/unit.service';

@Component({
    selector: 'app-objective-indicator',
    templateUrl: './objective-indicator.component.html',
    styleUrls: ['./objective-indicator.component.css']
})
export class ObjectiveIndicatorComponent implements OnInit, DoCheck {
    select_units: any = []
    checkbox_objectives_indicators: any = []
    checkboxs: any = []
    text_indicator: string = ''
    savedPlanningUnit: any

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    planningAddObjectiveIndicator = new FormGroup({
        indicator: new FormControl(),
        select_unit: new FormControl(),
        objective_indicator: new FormControl(),
    });

    constructor(
        private unitService: UnitService,
        private planningComponent: PlanningComponent,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddObjectiveIndicator = this.formBuilder.group(
            {
                indicator: ['', [Validators.required]],
                objective_indicator: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
            })
        this.selectUnits()
    }

    ngDoCheck(): void {
        if (this.unitService.savedPlanningUnit !== this.savedPlanningUnit) {
            this.savedPlanningUnit = this.unitService.savedPlanningUnit;
            if (this.savedPlanningUnit) {
                this.select_units.push(this.savedPlanningUnit);
            }
        }
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

    savePlanningObjectiveIndicator(planning: any) {
        this.checkboxs.map((element: any) => {
            element.indicator = planning.indicator
            element.unit = this.listUnits(planning.unit)
        })

        this.planningService.addPlanningObjectiveIndicator(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El OA' + record.oa + ' con el indicador fue creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El OA' + record.oa + ' con el indicador ya está creado!');
                });

                await this.planningComponent.loadPlannings();

                this.planningAddObjectiveIndicator.patchValue({ objective_indicator: false });
                this.planningAddObjectiveIndicator.patchValue({ select_unit: '' });
                this.planningAddObjectiveIndicator.patchValue({ indicator: '' });
                this.checkboxs = []
                this.checkbox_objectives_indicators = []
            }
        });

    }

    loadCheckBoxIndicatorsUnit(id: any) {
        this.checkbox_objectives_indicators = []
        this.planningService.getIdObjective(id).subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.checkbox_objectives_indicators.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name
                })
            })
        })
    }

    onInputUnitsIndicators(event: any) {
        let val = event.target.value;
        let opts_units = event.target.list.childNodes;
        for (let i = 0; i < opts_units.length; i++) {
            if (opts_units[i].value === val) {
                this.loadCheckBoxIndicatorsUnit(opts_units[i].id);
                break;
            }
        }
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
            this.text_indicator = ''
        }

    }

    previewIndicators(name: string) {
        this.text_indicator = name
    }

    listUnits(name: any) {
        let list = this.select_units.filter((x: any) => x.name === name)[0];
        return list.id;
    }

    disabledButton(planning: any) {
        const result = planning.every((elemento: any) => {
            return Boolean(elemento);
        });

        return !result;
    }


    get indicator() {
        return this.planningAddObjectiveIndicator.get('indicator');
    }


    get select_unit() {
        return this.planningAddObjectiveIndicator.get('select_unit');
    }

    get objective_indicator() {
        return this.planningAddObjectiveIndicator.get('objective_indicator');
    }
}
