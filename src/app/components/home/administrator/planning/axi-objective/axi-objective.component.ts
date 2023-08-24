import { Component, DoCheck, ElementRef, Inject, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/services/admin/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { PlanningComponent } from '../planning.component';
import { AxiService } from 'src/app/services/admin/axi.service';
import { ObjectiveService } from 'src/app/services/admin/objective.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
    selector: 'app-axi-objective',
    templateUrl: './axi-objective.component.html',
    styleUrls: ['./axi-objective.component.css']
})
export class AxiObjectiveComponent implements OnInit, DoCheck {

    select_axis: any = []
    list_objectives: any = []
    list_objectives_axis: any = []
    list_update_objectives_axis: any = []
    checkboxs: any = []
    nocheckboxs: any = []
    text_objective: string = ''
    savedPlanningSubjectAxi: any;
    savedPlanningObjective: any;
    list_objectives_table: any[] = []
    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    planningAddAxiObjective = new FormGroup({
        select_axi: new FormControl(),
        objective_axi: new FormControl(),
    });

    planningUpdateAxiObjective = new FormGroup({
        update_select_axi: new FormControl(),
        update_objective_axi: new FormControl(),
    });


    constructor(
        public resourcesService: ResourcesService,
        private objectiveService: ObjectiveService,
        private axiService: AxiService,
        private planningComponent: PlanningComponent,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.planningAddAxiObjective = this.formBuilder.group(
            {
                select_axi: ['', [Validators.required]],
                objective_axi: [],
            })
        this.planningUpdateAxiObjective = this.formBuilder.group(
            {
                update_select_axi: ['', [Validators.required]],
                update_objective_axi: [],
            })
        this.selectAxis()
        this.loadObjectives()
        this.getAxiObjectiveForTable()
    }

    ngDoCheck(): void {
        this.resourcesService.datalistArray(this.axiService.savedPlanningSubjectAxi, this.select_axis);
        this.resourcesService.datalist(this.objectiveService.savedPlanningObjective, this.savedPlanningObjective, this.list_objectives_axis);
    }

    getAxiObjectiveForTable() {
        this.axiService.getSelectAxisObjectives().subscribe((data) => {
            this.list_objectives_table = this.groupObjectivesTable(data);
            this.calculatePagedItems();
        });
    }

    editAxiObjective(data: any) {
        this.planningUpdateAxiObjective.get('id')?.setValue(data.id);

        let selectedAxi = this.select_axis.find((item: any) => item.id === data.id_axi).name;
        this.planningUpdateAxiObjective.get('update_select_axi')?.setValue(selectedAxi);

        this.checkboxs = [];

        for (let objective of data.objectives) {
            let edit_selected = this.list_update_objectives_axis.find((item: any) => item.id === objective.id_objective);
            if (edit_selected) {
                edit_selected.checked = true;
                this.checkboxs.push({
                    id: edit_selected.id,
                    checked: edit_selected.checked
                })
            }
        }

        for (let objective of this.list_update_objectives_axis) {
            let edit_deselect = data.objectives.find((item: any) => item.id_objective === objective.id);
            if (!edit_deselect) {
                objective.checked = false;
            }
        }
    }

    async savePlanningAxiObjective(data: any) {

        this.checkboxs.map((element: any) => {
            element.axi = this.resourcesService.list(data.axi, this.select_axis)
        })

        this.axiService.addPlanningAxiObjective(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                this.getAxiObjectiveForTable();

                this.planningAddAxiObjective.patchValue({ objective_axi: false });
                this.planningAddAxiObjective.patchValue({ select_axi: '' });
                this.checkboxs = []
            }
        });

        
    }


    async updatePlanningAxiObjective(data: any) {
        this.checkboxs.map((element: any) => {
            element.axi = this.resourcesService.list(data.axi, this.select_axis)
        })

        this.axiService.updatePlanningAxiObjective(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {

                const { insertedRecords, existingRecords} = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });
                this.getAxiObjectiveForTable();

                this.checkboxs = []
            }
        });
        
    }

    selectAxis() {
        this.select_axis = []
        this.axiService.getSelectAxis().subscribe((axis: any) => {
            axis.map((axi: any) => {
                this.select_axis.push({
                    id: axi.id,
                    name: axi.course + '/' + axi.subject + '/' + axi.name
                })
            })
        })
    }

    loadObjectives() {
        this.list_objectives_axis = []
        this.list_update_objectives_axis = []
        this.planningService.getIdPlanning('objectives').subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.list_objectives_axis.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name,
                    checked: false
                })

                this.list_update_objectives_axis.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name,
                    checked: false
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

            let selected = this.list_update_objectives_axis.find((item: any) => item.id === id);
            if (selected) {
                selected.checked = true;
            }

        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== id)
            this.text_objective = ''

            let deselect = this.list_update_objectives_axis.find((item: any) => item.id === id);
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
        this.text_objective = name;
    }

    get totalPages(): number {
        return Math.ceil(this.list_objectives_table.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.list_objectives_table.slice(startIndex, endIndex);
    }

    pageChanged(pageNumber: number) {
        this.currentPage = pageNumber;
        this.calculatePagedItems();
    }

    groupObjectivesTable(data: any) {
        const result: any[] = [];
        const seenIds = new Set();

        data.forEach((item: any) => {
            const idAxi = item.id_axi;
            if (!seenIds.has(idAxi)) {
                seenIds.add(idAxi);
                result.push({
                    id_axi: idAxi,
                    name_axi: item.name_axi,
                    name_subject: item.name_subject,
                    objectives: []
                });
            }

            result.forEach(res => {
                if (res.id_axi === idAxi) {
                    res.objectives.push({
                        id_objective: item.id_objective,
                        oa: item.oa
                    });
                }
            });
        });

        return result;
    }

    get select_axi() {
        return this.planningAddAxiObjective.get('select_axi');
    }

    get objective_axi() {
        return this.planningAddAxiObjective.get('objective_axi');
    }

    get update_select_axi() {
        return this.planningUpdateAxiObjective.get('update_select_axi');
    }

    get update_objective_axi() {
        return this.planningUpdateAxiObjective.get('update_objective_axi');
    }

}
