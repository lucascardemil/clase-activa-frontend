import { Component, DoCheck, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/services/admin/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { PlanningComponent } from '../planning.component';
import { UnitService } from 'src/app/services/admin/unit.service';
import { SkillService } from 'src/app/services/admin/skill.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
    selector: 'app-unit-skill',
    templateUrl: './unit-skill.component.html',
    styleUrls: ['./unit-skill.component.css']
})
export class UnitSkillComponent implements OnInit, DoCheck {

    select_units: any = []
    list_skills: any = []
    checkboxs: any = []
    text_skill: string = ''
    savedPlanningUnit: any
    savedPlanningSkill: any

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    constructor(
        private resourcesService: ResourcesService,
        private skillService: SkillService,
        private unitService: UnitService,
        private planningComponent: PlanningComponent,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }


    planningAddUnitSkill = new FormGroup({
        select_unit: new FormControl(),
        skill_unit: new FormControl(),
    });

    ngOnInit(): void {
        this.planningAddUnitSkill = this.formBuilder.group(
            {
                skill_unit: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
            })
        this.loadSkills()
    }

    ngDoCheck(): void {
        // if (this.unitService.savedPlanningUnit !== this.savedPlanningUnit) {
        //     this.savedPlanningUnit = this.unitService.savedPlanningUnit;
        //     if (this.savedPlanningUnit) {
        //         this.select_units.push(this.savedPlanningUnit);
        //     }
        // }
        // if (this.skillService.savedPlanningSkill !== this.savedPlanningSkill) {
        //     this.savedPlanningUnit = this.skillService.savedPlanningSkill;
        //     if (this.savedPlanningSkill) {
        //         this.list_skills.push(this.savedPlanningSkill);
        //     }
        // }
        this.resourcesService.datalist(this.unitService.savedPlanningUnit, this.savedPlanningUnit, this.select_units);
        this.resourcesService.datalist(this.skillService.savedPlanningSkill, this.savedPlanningSkill, this.list_skills);
    }

    loadSkills() {
        this.list_skills = []
        let table = 'skills'
        this.planningService.getIdPlanning(table).subscribe((skills: any) => {
            skills.map((skill: any) => {
                this.list_skills.push({
                    id: skill.id,
                    oa: 'OAH' + skill.oa,
                    name: skill.name
                })
            })
        })
    }

    savePlanningUnitSkill(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.listUnits(planning.unit)
        })

        this.unitService.addPlanningUnitSkill(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                await this.planningComponent.loadPlannings();

                this.planningAddUnitSkill.patchValue({ skill_unit: false });
                this.planningAddUnitSkill.patchValue({ select_unit: '' });
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
            this.text_skill = ''
        }

    }

    previewSkill(name: string) {
        this.text_skill = name
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
        return this.planningAddUnitSkill.get('select_unit');
    }

    get skill_unit() {
        return this.planningAddUnitSkill.get('skill_unit');
    }
}
