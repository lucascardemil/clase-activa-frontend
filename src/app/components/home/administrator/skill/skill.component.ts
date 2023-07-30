import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/services/admin/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { SkillService } from 'src/app/services/admin/skill.service';
import { PlanningComponent } from '../planning/planning.component';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
    selector: 'app-skill',
    templateUrl: './skill.component.html',
    styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

    list_skills: any = []
    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    planningAddSkill = new FormGroup({
        skill: new FormControl(),
        number_oah: new FormControl(),
    });

    planningUpdateSkill = new FormGroup({
        update_skill: new FormControl(),
        update_number_oah: new FormControl(),
    });

    constructor(
        private planningComponent: PlanningComponent,
        public resourcesService: ResourcesService,
        private skillService: SkillService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.planningAddSkill = this.formBuilder.group(
            {
                skill: ['', [Validators.required]],
                number_oah: ['', [Validators.required]],
            })
        this.planningUpdateSkill = this.formBuilder.group(
            {
                id: [],
                update_skill: ['', [Validators.required]],
                update_number_oah: ['', [Validators.required]],
            })
        this.getSkillsForTable();
    }

    getSkillsForTable() {
        this.skillService.getSelectSkills().subscribe((skills) => {
            this.list_skills = skills;
            this.calculatePagedItems();
        });
    }

    editSkill(skill: any) {
        this.planningUpdateSkill.get('id')?.setValue(skill.id);
        this.planningUpdateSkill.get('update_number_oah')?.setValue(skill.oa);
        this.planningUpdateSkill.get('update_skill')?.setValue(skill.name);
    }

    savePlanningSkill(skill: any) {
        this.skillService.addPlaningSkill(skill).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);
                this.getSkillsForTable();

                this.skillService.savePlanningSkill({
                    id: res.result.id,
                    oa: 'OAH' + res.result.oa,
                    name: res.result.name
                })

            } else {
                this.notyf.error(res.message);
            }
        });
    }

    updatePlanningSkill(skill: any) {
        this.skillService.updatePlaningSkill(skill).subscribe(async (res: any) => {
            if (res.status === 'success') {
                this.notyf.success(res.message);
                this.getSkillsForTable();

                this.skillService.savePlanningSkill({
                    id: res.result.id,
                    oa: 'OAH' + res.result.oa,
                    name: res.result.name
                })
                
                await this.planningComponent.loadPlannings();
            } else {
                this.notyf.error(res.message);
            }
        });
    }

    clearForm() {
        this.skill?.setValue('');
        this.number_oah?.setValue('');
    }

    get totalPages(): number {
        return Math.ceil(this.list_skills.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.list_skills.slice(startIndex, endIndex);
    }

    pageChanged(pageNumber: number) {
        this.currentPage = pageNumber;
        this.calculatePagedItems();
    }

    get skill() {
        return this.planningAddSkill.get('skill');
    }

    get number_oah() {
        return this.planningAddSkill.get('number_oah');
    }


    get update_skill() {
        return this.planningUpdateSkill.get('update_skill');
    }

    get update_number_oah() {
        return this.planningUpdateSkill.get('update_number_oah');
    }

}
