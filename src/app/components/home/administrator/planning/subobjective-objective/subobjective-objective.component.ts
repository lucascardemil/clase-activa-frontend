import { Component, DoCheck, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { PlanningComponent } from '../planning.component';
import { PlanningService } from 'src/app/services/admin/planning.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ObjectiveService } from 'src/app/services/admin/objective.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { SubobjectiveService } from 'src/app/services/admin/subobjective.service';

@Component({
    selector: 'app-subobjective-objective',
    templateUrl: './subobjective-objective.component.html',
    styleUrls: ['./subobjective-objective.component.css']
})
export class SubobjectiveObjectiveComponent implements OnInit {

    select_subobjectives: any = []
    list_objectives: any = []
    list_objectives_subobjectives: any = []
    list_update_objectives_subobjectives: any = []
    checkboxs: any = []
    text_objective: string = ''
    list_preview_subobjectives: any = []
    savedPlanningObjective: any
    savedPlanningSubObjective: any;
    list_table: any[] = []

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    planningAddObjectiveSubObjective = new FormGroup({
        select_subobjective: new FormControl(),
        objective: new FormControl()
    });

    planningUpdateObjectiveSubObjective = new FormGroup({
        update_subObjective: new FormControl(),
        update_objective: new FormControl()
    });

    constructor(
        public resourcesService: ResourcesService,
        private objectiveService: ObjectiveService,
        private subobjectiveService: SubobjectiveService,
        private planningComponent: PlanningComponent,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {

        this.planningAddObjectiveSubObjective = this.formBuilder.group(
            {
                select_subobjective: ['', [Validators.required]],
                objective: ['', [Validators.required]]
            })

        this.planningUpdateObjectiveSubObjective = this.formBuilder.group(
            {
                update_id: 0,
                update_select_subobjective: ['', [Validators.required]],
                update_objective: ['', [Validators.required]]
            })
        this.selectSubObjectives();
        this.loadObjectives();
        this.getSubObjectiveForTable();
    }

    ngDoCheck(): void {
        this.resourcesService.datalist(this.subobjectiveService.savedPlanningSubObjective, this.savedPlanningSubObjective, this.select_subobjectives);
        this.resourcesService.datalist(this.objectiveService.savedPlanningObjective, this.savedPlanningObjective, this.list_objectives_subobjectives);
    }

    getSubObjectiveForTable() {
        this.subobjectiveService.getSelectSubObjectivesObjectives().subscribe((data) => {
            this.list_table = this.groupObjectivesTable(data);
            this.calculatePagedItems();
        });
    }

    editObjectiveSubObjective(data: any) {
        this.planningUpdateObjectiveSubObjective.get('id')?.setValue(data.id);

        let selectedSubObjective = this.select_subobjectives.find((item: any) => item.id === data.id_subobjective).name;
        this.planningUpdateObjectiveSubObjective.get('update_select_subobjective')?.setValue(selectedSubObjective);

        this.checkboxs = [];

        for (let objective of data.objectives) {
            let edit_selected = this.list_update_objectives_subobjectives.find((item: any) => item.id === objective.id_objective);
            if (edit_selected) {
                edit_selected.checked = true;
                this.checkboxs.push({
                    id: edit_selected.id,
                    checked: edit_selected.checked
                })
            }
        }

        for (let objective of this.list_update_objectives_subobjectives) {
            let edit_deselect = data.objectives.find((item: any) => item.id_objective === objective.id);
            if (!edit_deselect) {
                objective.checked = false;
            }
        }
    }

    async savePlanningSubObjective(data: any) {
        this.checkboxs.map((element: any) => {
            element.subObjective = this.resourcesService.list(data.subObjective, this.select_subobjectives)
        });

        this.subobjectiveService.addPlanningSubObjective(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El OA' + record.oa + ' con el subjetivo fue creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El OA' + record.oa + ' con el subjetivo ya está creado!');
                });
                
                this.getSubObjectiveForTable();

                this.planningAddObjectiveSubObjective.patchValue({ objective: false });
                this.planningAddObjectiveSubObjective.patchValue({ select_subobjective: '' });
                this.checkboxs = []
            }
        });
        await this.planningComponent.loadPlannings();
    }


    async updatePlanningSubObjective(data: any) {
        this.checkboxs.map((element: any) => {
            element.subObjective = this.resourcesService.list(data.subObjective, this.select_subobjectives)
        });

        this.subobjectiveService.updatePlanningSubObjective(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El OA' + record.oa + ' con el subjetivo fue creado con exito!');
                });


                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El OA' + record.oa + ' con el subjetivo ya está creado!');
                });

                this.getSubObjectiveForTable();
                this.checkboxs = []
            }
        });
        await this.planningComponent.loadPlannings();
    }

    selectSubObjectives() {
        this.select_subobjectives = []
        this.subobjectiveService.getSelectSubObjectives().subscribe((subobjectives: any) => {
            subobjectives.map((subobjective: any) => {
                this.select_subobjectives.push({
                    id: subobjective.id,
                    name: subobjective.name.replace(/\n/g, "")
                })
            })
        })
    }

    loadObjectives() {
        this.list_objectives_subobjectives = []
        this.list_update_objectives_subobjectives = []
        this.planningService.getIdPlanning('objectives').subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.list_objectives_subobjectives.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name,
                    checked: false
                })

                this.list_update_objectives_subobjectives.push({
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

            let selected = this.list_update_objectives_subobjectives.find((item: any) => item.id === id);
            if (selected) {
                selected.checked = true;
            }

        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== id)
            this.text_objective = ''

            let deselect = this.list_update_objectives_subobjectives.find((item: any) => item.id === id);
            if (deselect) {
                deselect.checked = false;
                this.checkboxs.push({
                    id: deselect.id,
                    checked: deselect.checked
                })
            }
        }
    }

    previewObjectiveSubObjectives(objective: number, name: string) {
        this.text_objective = name
        this.subobjectiveService.getPreviewSubObjective(objective).subscribe((objectives: any) => this.list_preview_subobjectives = objectives)
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
            const id_subobjective = item.id_subobjective;
            if (!seenIds.has(id_subobjective)) {
                seenIds.add(id_subobjective);
                result.push({
                    id_subobjective: id_subobjective,
                    name_subobjective: item.name,
                    objectives: []
                });
            }

            result.forEach(res => {
                if (res.id_subobjective === id_subobjective) {
                    res.objectives.push({
                        id_objective: item.id_objective,
                        oa: item.oa,
                        checked: false
                    });
                }
            });
        });

        return result;
    }

    get select_subobjective() {
        return this.planningAddObjectiveSubObjective.get('select_subobjective');
    }

    get objective() {
        return this.planningAddObjectiveSubObjective.get('objective');
    }

    get update_select_subobjective() {
        return this.planningUpdateObjectiveSubObjective.get('update_select_subobjective');
    }

    get update_objective() {
        return this.planningUpdateObjectiveSubObjective.get('update_objective');
    }

}
