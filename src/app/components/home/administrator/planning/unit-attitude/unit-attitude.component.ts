import { Component, DoCheck, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { PlanningService } from 'src/app/services/admin/planning.service';
import { PlanningComponent } from '../planning.component';
import { UnitService } from 'src/app/services/admin/unit.service';
import { AttitudeService } from 'src/app/services/admin/attitude.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
    selector: 'app-unit-attitude',
    templateUrl: './unit-attitude.component.html',
    styleUrls: ['./unit-attitude.component.css']
})
export class UnitAttitudeComponent implements OnInit, DoCheck {

    select_units: any = []
    list_attitudes: any = []
    checkboxs: any = []
    text_attitude: string = ''
    savedPlanningUnit: any
    savedPlanningAttitude: any

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    constructor(
        private resourcesService: ResourcesService,
        private attitudeService: AttitudeService,
        private unitService: UnitService,
        private planningComponent: PlanningComponent,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    planningAddUnitAttitude = new FormGroup({
        select_unit: new FormControl(),
        attitude_unit: new FormControl(),
    });

    ngOnInit(): void {
        this.planningAddUnitAttitude = this.formBuilder.group(
            {
                attitude_unit: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
            })
        this.loadAttitudes()
    }

    ngDoCheck(): void {
        // if (this.unitService.savedPlanningUnit !== this.savedPlanningUnit) {
        //     this.savedPlanningUnit = this.unitService.savedPlanningUnit;
        //     if (this.savedPlanningUnit) {
        //         this.select_units.push(this.savedPlanningUnit);
        //     }
        // }

        // if (this.attitudeService.savedPlanningAttitude !== this.savedPlanningAttitude) {
        //     this.savedPlanningAttitude = this.attitudeService.savedPlanningAttitude;
        //     if (this.savedPlanningAttitude) {
        //         this.list_attitudes.push(this.savedPlanningAttitude);
        //     }
        // }

        this.resourcesService.datalist(this.unitService.savedPlanningUnit, this.savedPlanningUnit, this.select_units);
        this.resourcesService.datalist(this.attitudeService.savedPlanningAttitude, this.savedPlanningAttitude, this.list_attitudes);
    }

    loadAttitudes() {
        this.list_attitudes = []
        let table = 'attitudes'
        this.planningService.getIdPlanning(table).subscribe((attitudes: any) => {
            attitudes.map((attitude: any) => {
                this.list_attitudes.push({
                    id: attitude.id,
                    oa: 'OAA' + attitude.oa,
                    name: attitude.name
                })
            })
        })
    }

    savePlanningUnitAttitude(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.listUnits(planning.unit)
        })

        this.unitService.addPlanningUnitAttitude(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                await this.planningComponent.loadPlannings();

                this.planningAddUnitAttitude.patchValue({ attitude_unit: false });
                this.planningAddUnitAttitude.patchValue({ select_unit: '' });
                this.checkboxs = []
            }
        });
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
        }

    }

    previewAttitude(name: string) {
        this.text_attitude = name
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
        return this.planningAddUnitAttitude.get('select_unit');
    }

    get attitude_unit() {
        return this.planningAddUnitAttitude.get('attitude_unit');
    }

}
