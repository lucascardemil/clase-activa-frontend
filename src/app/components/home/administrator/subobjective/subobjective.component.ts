import { Component, Inject, OnInit } from '@angular/core';
import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ObjectiveService } from 'src/app/services/admin/objective.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { SubobjectiveService } from 'src/app/services/admin/subobjective.service';
import { PlanningComponent } from '../planning/planning.component';


@Component({
    selector: 'app-subobjective',
    templateUrl: './subobjective.component.html',
    styleUrls: ['./subobjective.component.css']
})
export class SubobjectiveComponent implements OnInit {

    list_subobjectives: any = [];

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    planningAddSubObjective = new FormGroup({
        subobjective: new FormControl(),
    });

    planningUpdateSubObjective = new FormGroup({
        update_subobjective: new FormControl(),
    });

    constructor(
        private planningComponent: PlanningComponent,
        private subobjectiveService: SubobjectiveService,
        public resourcesService: ResourcesService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddSubObjective = this.formBuilder.group(
            {
                subobjective: ['', [Validators.required]],
            })

        this.planningUpdateSubObjective = this.formBuilder.group(
            {
                id: [''],
                update_subobjective: ['', [Validators.required]],
            })
        this.getSubObjectivesForTable()
    }

    getSubObjectivesForTable() {
        this.subobjectiveService.getSelectSubObjectives().subscribe((objectives) => {
            this.list_subobjectives = objectives;
            this.calculatePagedItems();
        });
    }


    saveSubObjective(planning: any) {
        this.subobjectiveService.addSubObjective(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);
                this.getSubObjectivesForTable();

                this.subobjectiveService.savePlanningSubObjective({
                    id: res.result.id,
                    name: res.result.name
                })

            } else {
                this.notyf.error(res.message);
            }
        });
    }

    editSubObjective(objective: any) {
        this.planningUpdateSubObjective.get('id')?.setValue(objective.id);
        this.planningUpdateSubObjective.get('update_subobjective')?.setValue(objective.name);
    }

    updatePlanningSubObjective(objectives: any) {
        this.subobjectiveService.updateSubObjective(objectives).subscribe(
            async (res: any) => {
                if (res.status === 'success') {
                    this.notyf.success(res.message);
                    this.getSubObjectivesForTable();

                    this.subobjectiveService.savePlanningSubObjective({
                        id: res.result.id,
                        name: res.result.name
                    })

                    

                } else {
                    this.notyf.error(res.message);
                }
            });
    }

    clearForm() {
        this.subobjective?.setValue('');
    }

    get totalPages(): number {
        return Math.ceil(this.list_subobjectives.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.list_subobjectives.slice(startIndex, endIndex);
    }

    pageChanged(pageNumber: number) {
        this.currentPage = pageNumber;
        this.calculatePagedItems();
    }


    get subobjective() {
        return this.planningAddSubObjective.get('subobjective');
    }


    get update_subobjective() {
        return this.planningUpdateSubObjective.get('update_subobjective');
    }

}
