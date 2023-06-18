import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/services/teacher/planning.service';
import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { AttitudeService } from 'src/app/services/teacher/attitude.service';

@Component({
    selector: 'app-attitude',
    templateUrl: './attitude.component.html',
    styleUrls: ['./attitude.component.css']
})
export class AttitudeComponent implements OnInit {

    list_attitudes: any = []

    planningAddAttitude = new FormGroup({
        attitude: new FormControl(),
        number_oaa: new FormControl(),
    });

    constructor(
        private attitudeService: AttitudeService,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddAttitude = this.formBuilder.group(
            {
                attitude: ['', [Validators.required]],
                number_oaa: ['', [Validators.required]],
            })
    }

    savePlanningAttitude(planning: any) {
        this.planningService.addPlaningAttitude(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);

                this.attitudeService.savePlanningAttitude({
                    id: res.result.id,
                    oa: 'OAA' + res.result.oa,
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
        this.attitude?.setValue('');
        this.number_oaa?.setValue('');
    }

    get attitude() {
        return this.planningAddAttitude.get('attitude');
    }

    get number_oaa() {
        return this.planningAddAttitude.get('number_oaa');
    }

}
