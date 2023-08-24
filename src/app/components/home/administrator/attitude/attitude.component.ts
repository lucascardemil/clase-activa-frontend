import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/services/admin/planning.service';
import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { AttitudeService } from 'src/app/services/admin/attitude.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { PlanningComponent } from '../planning/planning.component';

@Component({
    selector: 'app-attitude',
    templateUrl: './attitude.component.html',
    styleUrls: ['./attitude.component.css']
})
export class AttitudeComponent implements OnInit {

    list_attitudes: any = []
    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    planningAddAttitude = new FormGroup({
        attitude: new FormControl(),
        number_oaa: new FormControl(),
    });

    planningUpdateAttitude = new FormGroup({
        update_number_oaa: new FormControl(),
        update_attitude: new FormControl(),
    });

    constructor(
        private planningComponent: PlanningComponent,
        public resourcesService: ResourcesService,
        private attitudeService: AttitudeService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddAttitude = this.formBuilder.group(
            {
                attitude: ['', [Validators.required]],
                number_oaa: ['', [Validators.required]],
            })
        this.planningUpdateAttitude = this.formBuilder.group(
            {
                id: [''],
                update_number_oaa: ['', [Validators.required]],
                update_attitude: ['', [Validators.required]],
            })
        this.getAttitudesForTable()
    }

    getAttitudesForTable() {
        this.attitudeService.getSelectAttitudes().subscribe((attitudes) => {
            this.list_attitudes = attitudes;
            this.calculatePagedItems();
        });
    }

    editAttitude(attitude: any) {
        this.planningUpdateAttitude.get('id')?.setValue(attitude.id);
        this.planningUpdateAttitude.get('update_number_oaa')?.setValue(attitude.oa);
        this.planningUpdateAttitude.get('update_attitude')?.setValue(attitude.name);
    }

    savePlanningAttitude(attitude: any) {
        this.attitudeService.addPlaningAttitude(attitude).subscribe(async (res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);
                this.getAttitudesForTable();

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

    updatePlanningAttitude(attitude: any) {
        this.attitudeService.updatePlaningAttitude(attitude).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);
                this.getAttitudesForTable();

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

    clearForm() {
        this.attitude?.setValue('');
        this.number_oaa?.setValue('');
    }

    get totalPages(): number {
        return Math.ceil(this.list_attitudes.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.list_attitudes.slice(startIndex, endIndex);
    }

    pageChanged(pageNumber: number) {
        this.currentPage = pageNumber;
        this.calculatePagedItems();
    }

    get attitude() {
        return this.planningAddAttitude.get('attitude');
    }

    get number_oaa() {
        return this.planningAddAttitude.get('number_oaa');
    }

    get update_attitude() {
        return this.planningUpdateAttitude.get('update_attitude');
    }

    get update_number_oaa() {
        return this.planningUpdateAttitude.get('update_number_oaa');
    }

}
