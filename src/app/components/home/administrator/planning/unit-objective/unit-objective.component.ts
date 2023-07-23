import { Component, DoCheck, ElementRef, Inject, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { PlanningComponent } from '../planning.component';
import { PlanningService } from 'src/app/services/admin/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitService } from 'src/app/services/admin/unit.service';
import { ObjectiveService } from 'src/app/services/admin/objective.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
    selector: 'app-unit-objective',
    templateUrl: './unit-objective.component.html',
    styleUrls: ['./unit-objective.component.css']
})
export class UnitObjectiveComponent implements OnInit, DoCheck {

    select_units: any = []
    list_objectives: any = []
    list_objectives_units: any = []
    list_update_objectives_units: any = []
    checkboxs: any = []
    text_objective: string = ''
    savedPlanningUnit: any
    savedPlanningObjective: any
    list_table: any[] = []
    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    planningAddUnitObjective = new FormGroup({
        select_unit: new FormControl(),
        objective_unit: new FormControl()
    });

    planningUpdateUnitObjective = new FormGroup({
        update_select_unit: new FormControl(),
        update_objective_unit: new FormControl()
    });

    constructor(
        public resourcesService: ResourcesService,
        private objectiveService: ObjectiveService,
        private unitService: UnitService,
        private planningComponent: PlanningComponent,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) {

    }

    ngOnInit(): void {

        this.planningAddUnitObjective = this.formBuilder.group(
            {
                objective_unit: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
            })
        this.planningUpdateUnitObjective = this.formBuilder.group(
            {
                update_select_unit: ['', [Validators.required]],
                update_objective_unit: [],
            })
        this.selectUnitsObjectives()
        this.loadObjectives()
        this.getUnitObjectiveForTable()
    }

    ngDoCheck(): void {
        this.resourcesService.datalist(this.unitService.savedPlanningUnit, this.savedPlanningUnit, this.select_units);
        this.resourcesService.datalist(this.objectiveService.savedPlanningObjective, this.savedPlanningObjective, this.list_objectives_units);
    }

    getUnitObjectiveForTable() {
        this.unitService.getSelectUnitsObjectives().subscribe((data) => {
            this.list_table = this.groupObjectivesTable(data);
            this.calculatePagedItems();
        });
    }

    editUnitObjective(data: any) {
        this.planningUpdateUnitObjective.get('id')?.setValue(data.id);

        let selectedUnit = this.select_units.find((item: any) => item.id === data.id_unit).name;
        this.planningUpdateUnitObjective.get('update_select_unit')?.setValue(selectedUnit);

        this.checkboxs = [];

        for (let objective of data.objectives) {
            let edit_selected = this.list_update_objectives_units.find((item: any) => item.id === objective.id_objective);
            if (edit_selected) {
                edit_selected.checked = true;
                this.checkboxs.push({
                    id: edit_selected.id,
                    checked: edit_selected.checked,
                })
            }
        }

        for (let objective of this.list_update_objectives_units) {
            let edit_deselect = data.objectives.find((item: any) => item.id_objective === objective.id);
            if (!edit_deselect) {
                objective.checked = false;
            }
        }
    }


    async savePlanningUnitObjective(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.resourcesService.list(planning.unit, this.select_units)
        })

        this.unitService.addPlanningUnitObjective(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                this.getUnitObjectiveForTable();

                this.planningAddUnitObjective.patchValue({ objective_unit: false });
                this.planningAddUnitObjective.patchValue({ select_unit: '' });
                this.checkboxs = []
            }
        });
        await this.planningComponent.loadPlannings();
    }

    async updatePlanningUnitObjective(data: any) {
        this.checkboxs.map((element: any) => {
            element.unit = this.resourcesService.list(data.unit, this.select_units)
        })

        this.unitService.updatePlanningUnitObjective(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {

                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                this.getUnitObjectiveForTable();
                this.checkboxs = []
            }
        });

        await this.planningComponent.loadPlannings();
    }

    

    loadObjectives() {
        this.list_objectives_units = []
        this.list_update_objectives_units = []
        this.planningService.getIdPlanning('objectives').subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.list_objectives_units.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name,
                    checked: false
                })

                this.list_update_objectives_units.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name,
                    checked: false
                })
            })
        })
    }

    selectUnitsObjectives(){
        this.select_units = []
        this.unitService.getSelectUnits().subscribe((units: any) => {
            units.map((unit: any) => {
                this.select_units.push({
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

            let selected = this.list_update_objectives_units.find((item: any) => item.id === id);
            if (selected) {
                selected.checked = true;
            }

        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== id)
            this.text_objective = ''

            let deselect = this.list_update_objectives_units.find((item: any) => item.id === id);
            if (deselect) {
                deselect.checked = false;
                this.checkboxs.push({
                    id: deselect.id,
                    checked: deselect.checked
                })
            }
        }
    }

    previewObjective(name: string) {
        this.text_objective = name
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


    groupObjectivesTable(data: any) {
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
                    objectives: []
                });
            }

            result.forEach(res => {
                if (res.id_unit === id) {
                    res.objectives.push({
                        id_objective: item.id_objective,
                        oa: item.oa
                    });
                }
            });
        });

        return result;
    }

    get select_unit() {
        return this.planningAddUnitObjective.get('select_unit');
    }

    get objective_unit() {
        return this.planningAddUnitObjective.get('objective_unit');
    }

    get update_select_unit() {
        return this.planningUpdateUnitObjective.get('update_select_unit');
    }

    get update_objective_unit() {
        return this.planningUpdateUnitObjective.get('update_objective_unit');
    }
}
