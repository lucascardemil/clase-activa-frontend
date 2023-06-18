import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/services/teacher/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { SkillService } from 'src/app/services/teacher/skill.service';

@Component({
    selector: 'app-skill',
    templateUrl: './skill.component.html',
    styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

    planningAddSkill = new FormGroup({
        skill: new FormControl(),
        number_oah: new FormControl(),
    });

    constructor(
        private skillService: SkillService,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder) 
        {}

    ngOnInit(): void {
        this.planningAddSkill = this.formBuilder.group(
            {
                skill: ['', [Validators.required]],
                number_oah: ['', [Validators.required]],
            })
    }

    savePlanningSkill(planning: any) {
        this.planningService.addPlaningSkill(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.notyf.success(res.message);

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

    disabledButton(planning: any) {
        const result = planning.every((elemento: any) => {
            return Boolean(elemento);
        });

        return !result;
    }

    get skill() {
        return this.planningAddSkill.get('skill');
    }

    get number_oah() {
        return this.planningAddSkill.get('number_oah');
    }

}
