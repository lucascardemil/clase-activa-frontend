import { Component, Inject, OnInit } from '@angular/core';
import { PlanningService } from 'src/app/services/teacher/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ObjectiveService } from 'src/app/services/teacher/objective.service';

@Component({
    selector: 'app-objective',
    templateUrl: './objective.component.html',
    styleUrls: ['./objective.component.css']
})
export class ObjectiveComponent implements OnInit {

    planningAddObjective = new FormGroup({
        objective: new FormControl(),
        number_oa: new FormControl(),
    });

    constructor(
        private objectiveService: ObjectiveService,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddObjective = this.formBuilder.group(
            {
                objective: ['', [Validators.required]],
                number_oa: ['', [Validators.required]],
            })
    }


    savePlanningObjective(planning: any) {
        this.planningService.addPlaningObjective(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);

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

    disabledButton(planning: any) {
        const result = planning.every((elemento: any) => {
            return Boolean(elemento);
        });

        return !result;
    }

    clearForm() {
        this.objective?.setValue('');
        this.number_oa?.setValue('');
    }



    get number_oa() {
        return this.planningAddObjective.get('number_oa');
    }

    get objective() {
        return this.planningAddObjective.get('objective');
    }

}
