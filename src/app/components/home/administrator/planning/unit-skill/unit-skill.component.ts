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

    select_units_skills: any = []
    list_skills: any = []
    checkboxs: any = []
    text_skill: string = ''
    savedPlanningUnit: any
    savedPlanningSkill: any
    list_update_skills_units: any = []
    list_table: any[] = [];

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    constructor(
        public resourcesService: ResourcesService,
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

    planningUpdateUnitSkill = new FormGroup({
        update_skill_unit: new FormControl(),
        update_select_unit: new FormControl(),
    });

    ngOnInit(): void {
        this.planningAddUnitSkill = this.formBuilder.group(
            {
                skill_unit: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
            })
        this.planningUpdateUnitSkill = this.formBuilder.group(
            {
                update_skill_unit: ['', [Validators.required]],
                update_select_unit: ['', [Validators.required]],
            })
        this.selectUnitsSkills()
        this.loadSkills()
        this.getUnitSkillForTable()
    }

    ngDoCheck(): void {
        this.resourcesService.datalist(this.unitService.savedPlanningUnit, this.savedPlanningUnit, this.select_units_skills);
        this.resourcesService.datalist(this.skillService.savedPlanningSkill, this.savedPlanningSkill, this.list_skills);
    }

    getUnitSkillForTable() {
        this.unitService.getSelectUnitsSkills().subscribe((data) => {
            this.list_table = this.groupSkillsTable(data);
            this.calculatePagedItems();
        });
    }

    editUnitSkill(data: any) {
        this.planningUpdateUnitSkill.get('id')?.setValue(data.id);

        let selectedUnit = this.select_units_skills.find((item: any) => item.id === data.id_unit).name;
        this.planningUpdateUnitSkill.get('update_select_unit')?.setValue(selectedUnit);

        this.checkboxs = [];

        for (let skill of data.skills) {
            let edit_selected = this.list_update_skills_units.find((item: any) => item.id === skill.id_skill);
            if (edit_selected) {
                edit_selected.checked = true;
                this.checkboxs.push({
                    id: edit_selected.id,
                    checked: edit_selected.checked,
                })
            }
        }

        for (let skill of this.list_update_skills_units) {
            let edit_deselect = data.skills.find((item: any) => item.id_skill === skill.id);
            if (!edit_deselect) {
                skill.checked = false;
            }
        }
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

                this.list_update_skills_units.push({
                    id: skill.id,
                    oa: 'OAH' + skill.oa,
                    name: skill.name
                })
            })
        })
    }

    async savePlanningUnitSkill(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.resourcesService.list(planning.unit, this.select_units_skills)
        })

        this.unitService.addPlanningUnitSkill(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                this.getUnitSkillForTable();

                this.planningAddUnitSkill.patchValue({ skill_unit: false });
                this.planningAddUnitSkill.patchValue({ select_unit: '' });
                this.checkboxs = []
            }
        });

        // 
    }

    async updatePlanningUnitSkill(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.resourcesService.list(planning.unit, this.select_units_skills)
        })

        this.unitService.updatePlanningUnitSkill(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                this.getUnitSkillForTable();
                this.checkboxs = []
            }
        });

        // 
    }

    selectUnitsSkills() {
        this.select_units_skills = []
        this.unitService.getSelectUnits().subscribe((units: any) => {
            units.map((unit: any) => {
                this.select_units_skills.push({
                    id: unit.id,
                    name: unit.level + '/' + unit.course + '/' + unit.subject + '/' + unit.unit
                })
            })
        })
    }

    checkBox(event: any) {
        let id = event.target.id

        if (event.target.checked === true) {
            this.checkboxs.push({
                id: id,
                checked: true
            })

            let selected = this.list_update_skills_units.find((item: any) => item.id === id);
            if (selected) {
                selected.checked = true;
            }

        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== id)
            this.text_skill = ''

            let deselect = this.list_update_skills_units.find((item: any) => item.id === id);
            if (deselect) {
                deselect.checked = false;
                this.checkboxs.push({
                    id: deselect.id,
                    checked: deselect.checked
                })
            }
        }

    }

    previewSkill(name: string) {
        this.text_skill = name
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

    groupSkillsTable(data: any) {
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
                    skills: []
                });
            }

            result.forEach(res => {
                if (res.id_unit === id) {
                    res.skills.push({
                        id_skill: item.id_skill,
                        oa: item.oa
                    });
                }
            });
        });

        return result;
    }
    get select_unit() {
        return this.planningAddUnitSkill.get('select_unit');
    }

    get skill_unit() {
        return this.planningAddUnitSkill.get('skill_unit');
    }

    get update_select_unit() {
        return this.planningUpdateUnitSkill.get('update_select_unit');
    }

    get update_skill_unit() {
        return this.planningUpdateUnitSkill.get('update_skill_unit');
    }
}
