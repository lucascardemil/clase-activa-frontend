import { Component, Inject, OnInit } from '@angular/core';
import { PlanningService } from 'src/app/services/admin/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ObjectiveService } from 'src/app/services/admin/objective.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { PlanningComponent } from '../planning/planning.component';

@Component({
    selector: 'app-objective',
    templateUrl: './objective.component.html',
    styleUrls: ['./objective.component.css']
})
export class ObjectiveComponent implements OnInit {

    list_objectives: any = [];

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    planningAddObjective = new FormGroup({
        objective: new FormControl(),
        number_oa: new FormControl(),
    });

    planningUpdateObjective = new FormGroup({
        update_number_oa: new FormControl(),
        update_objective: new FormControl(),
    });

    constructor(
        private planningComponent: PlanningComponent,
        private objectiveService: ObjectiveService,
        public resourcesService: ResourcesService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddObjective = this.formBuilder.group(
            {
                objective: ['', [Validators.required]],
                number_oa: ['', [Validators.required]],
            })

        this.planningUpdateObjective = this.formBuilder.group(
            {
                id: [''],
                update_number_oa: ['', [Validators.required]],
                update_objective: ['', [Validators.required]],
            })
        this.getObjectivesForTable()
    }

    getObjectivesForTable() {
        this.objectiveService.getSelectObjectives().subscribe((objectives) => {
            this.list_objectives = objectives;
            this.calculatePagedItems();
        });
    }


    savePlanningObjective(planning: any) {
        this.objectiveService.addPlaningObjective(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);
                this.getObjectivesForTable();

                this.objectiveService.savePlanningObjective({
                    id: res.result.id,
                    oa: 'OA' + res.result.oa,
                    name: res.result.name
                })

            } else {
                this.notyf.error(res.message);
            }
        });
    }

    editObjective(objective: any) {
        this.planningUpdateObjective.get('id')?.setValue(objective.id);
        this.planningUpdateObjective.get('update_number_oa')?.setValue(objective.oa);
        this.planningUpdateObjective.get('update_objective')?.setValue(objective.name);
    }

    updatePlanningObjective(objectives: any) {
        this.objectiveService.updatePlaningObjective(objectives).subscribe(
            async (res: any) => {
                if (res.status === 'success') {
                    this.notyf.success(res.message);
                    this.getObjectivesForTable();

                    this.objectiveService.savePlanningObjective({
                        id: res.result.id,
                        oa: 'OA' + res.result.oa,
                        name: res.result.name
                    })

                    

                } else {
                    this.notyf.error(res.message);
                }
            });
    }

    clearForm() {
        this.objective?.setValue('');
        this.number_oa?.setValue('');
    }

    get totalPages(): number {
        return Math.ceil(this.list_objectives.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.list_objectives.slice(startIndex, endIndex);
    }

    pageChanged(pageNumber: number) {
        this.currentPage = pageNumber;
        this.calculatePagedItems();
    }

    get number_oa() {
        return this.planningAddObjective.get('number_oa');
    }

    get objective() {
        return this.planningAddObjective.get('objective');
    }

    get update_number_oa() {
        return this.planningUpdateObjective.get('update_number_oa');
    }

    get update_objective() {
        return this.planningUpdateObjective.get('update_objective');
    }

}
