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

    select_units_attitudes: any = []
    list_attitudes: any = []
    checkboxs: any = []
    text_attitude: string = ''
    text_update_attitude: string = ''
    savedPlanningUnit: any
    savedPlanningAttitude: any
    list_update_attitudes_units: any = []
    list_table: any[] = [];

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    constructor(
        public resourcesService: ResourcesService,
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

    planningUpdateUnitAttitude = new FormGroup({
        update_attitude_unit: new FormControl(),
        update_select_unit: new FormControl(),
    });

    ngOnInit(): void {
        this.planningAddUnitAttitude = this.formBuilder.group(
            {
                attitude_unit: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
            })

        this.planningUpdateUnitAttitude = this.formBuilder.group(
            {
                update_attitude_unit: ['', [Validators.required]],
                update_select_unit: ['', [Validators.required]],
            })
        this.selectUnitsAttitudes()
        this.loadAttitudes()
        this.getUnitAttitudeForTable()
    }

    ngDoCheck(): void {
        this.resourcesService.datalist(this.unitService.savedPlanningUnit, this.savedPlanningUnit, this.select_units_attitudes);
        this.resourcesService.datalist(this.attitudeService.savedPlanningAttitude, this.savedPlanningAttitude, this.list_attitudes);
    }

    getUnitAttitudeForTable() {
        this.unitService.getSelectUnitsAttitudes().subscribe((data) => {
            this.list_table = this.groupAttitudesTable(data);
            this.calculatePagedItems();
        });
    }

    editUnitAttitude(data: any) {
        this.planningUpdateUnitAttitude.get('id')?.setValue(data.id);

        let selectedUnit = this.select_units_attitudes.find((item: any) => item.id === data.id_unit).name;
        this.planningUpdateUnitAttitude.get('update_select_unit')?.setValue(selectedUnit);

        this.checkboxs = [];

        for (let attitude of data.attitudes) {
            let edit_selected = this.list_update_attitudes_units.find((item: any) => item.id === attitude.id_attitude);
            if (edit_selected) {
                edit_selected.checked = true;
                this.checkboxs.push({
                    id: edit_selected.id,
                    checked: edit_selected.checked,
                })
            }
        }

        for (let attitude of this.list_update_attitudes_units) {
            let edit_deselect = data.attitudes.find((item: any) => item.id_attitude === attitude.id);
            if (!edit_deselect) {
                attitude.checked = false;
            }
        }
    }

    loadAttitudes() {
        this.list_attitudes = []
        this.list_update_attitudes_units = []
        let table = 'attitudes'
        this.planningService.getIdPlanning(table).subscribe((attitudes: any) => {
            attitudes.map((attitude: any) => {
                this.list_attitudes.push({
                    id: attitude.id,
                    oa: 'OAA' + attitude.oa,
                    name: attitude.name
                })

                this.list_update_attitudes_units.push({
                    id: attitude.id,
                    oa: 'OAA' + attitude.oa,
                    name: attitude.name
                })
            })
        })
    }

    async savePlanningUnitAttitude(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.resourcesService.list(planning.unit, this.select_units_attitudes)
        })

        this.unitService.addPlanningUnitAttitude(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                this.getUnitAttitudeForTable()

                this.planningAddUnitAttitude.patchValue({ attitude_unit: false });
                this.planningAddUnitAttitude.patchValue({ select_unit: '' });
                this.checkboxs = []
            }
        });
        // await this.planningComponent.loadPlannings();
    }

    async updatePlanningUnitAttitude(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.resourcesService.list(planning.unit, this.select_units_attitudes)
        })

        console.log(this.checkboxs);

        // this.unitService.updatePlanningUnitAttitude(this.checkboxs).subscribe((res: any) => {
        //     if (res.status === 'success') {
        //         const { insertedRecords, existingRecords } = res.result;

        //         insertedRecords.forEach((record: any) => {
        //             this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
        //         });

        //         existingRecords.forEach((record: any) => {
        //             this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
        //         });

        //         this.getUnitAttitudeForTable()
        //         this.checkboxs = []
        //     }
        // });
        // await this.planningComponent.loadPlannings();
    }

    selectUnitsAttitudes() {
        this.select_units_attitudes = []
        this.unitService.getSelectUnits().subscribe((units: any) => {
            units.map((unit: any) => {
                this.select_units_attitudes.push({
                    id: unit.id,
                    name: unit.level + '/' + unit.course + '/' + unit.subject + '/' + unit.unit
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

            let selected = this.list_update_attitudes_units.find((item: any) => item.id === id);
            if (selected) {
                selected.checked = true;
            }

        }

        if (event.target.checked === false) {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== id)
            this.text_attitude = ''

            let deselect = this.list_update_attitudes_units.find((item: any) => item.id === id);
            if (deselect) {
                deselect.checked = false;
                this.checkboxs.push({
                    id: deselect.id,
                    checked: deselect.checked
                })
            }
        }

    }

    previewAttitude(name: string) {
        this.text_attitude = name
    }

    previewUpdateAttitude(name: string) {
        this.text_update_attitude = name
    }

    get totalPages(): number {
        return Math.ceil(this.list_table.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.list_table.slice(startIndex, endIndex);
    }

    pageChanged(pageNumber: number) {
        this.currentPage = pageNumber;
        this.calculatePagedItems();
    }

    groupAttitudesTable(data: any) {
        const result: any[] = [];
        const seenIds = new Set();

        data.forEach((item: any) => {
            const id = item.id_unit;
            if (!seenIds.has(id)) {
                seenIds.add(id);
                result.push({
                    id_unit: id,
                    name_unit: item.name_unit,
                    name_level: item.name_level,
                    name_course: item.name_course,
                    name_subject: item.name_subject,
                    attitudes: []
                });
            }

            result.forEach(res => {
                if (res.id_unit === id) {
                    res.attitudes.push({
                        id_attitude: item.id_attitude,
                        oa: item.oa
                    });
                }
            });
        });

        return result;
    }

    get select_unit() {
        return this.planningAddUnitAttitude.get('select_unit');
    }

    get attitude_unit() {
        return this.planningAddUnitAttitude.get('attitude_unit');
    }

    get update_select_unit() {
        return this.planningUpdateUnitAttitude.get('update_select_unit');
    }

    get update_attitude_unit() {
        return this.planningUpdateUnitAttitude.get('update_attitude_unit');
    }

}
