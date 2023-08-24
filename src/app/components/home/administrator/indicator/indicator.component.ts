import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningComponent } from '../planning/planning.component';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { IndicatorService } from 'src/app/services/admin/indicator.service';

@Component({
    selector: 'app-indicator',
    templateUrl: './indicator.component.html',
    styleUrls: ['./indicator.component.css']
})
export class IndicatorComponent implements OnInit {

    list_indicators: any = [];

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    planningAddIndicator = new FormGroup({
        indicator: new FormControl(),
    });

    planningUpdateIndicator = new FormGroup({
        update_indicator: new FormControl(),
    });

    constructor(
        private planningComponent: PlanningComponent,
        private indicatorService: IndicatorService,
        public resourcesService: ResourcesService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddIndicator = this.formBuilder.group(
            {
                indicator: ['', [Validators.required]],
            })

        this.planningUpdateIndicator = this.formBuilder.group(
            {
                id: [''],
                update_indicator: ['', [Validators.required]],
            })
        this.getIndicatorsForTable()
    }

    getIndicatorsForTable() {
        this.indicatorService.getSelectIndicators().subscribe((indicators) => {
            this.list_indicators = indicators;
            this.calculatePagedItems();
        });
    }


    saveIndicator(planning: any) {
        this.indicatorService.addIndicator(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);
                this.getIndicatorsForTable();

                this.indicatorService.savePlanningIndicator({
                    id: res.result.id,
                    name: res.result.name
                })

            } else {
                this.notyf.error(res.message);
            }
        });
    }

    editIndicator(objective: any) {
        this.planningUpdateIndicator.get('id')?.setValue(objective.id);
        this.planningUpdateIndicator.get('update_indicator')?.setValue(objective.name);
    }

    updatePlanningIndicator(indicators: any) {
        this.indicatorService.updateIndicator(indicators).subscribe(
            async (res: any) => {
                if (res.status === 'success') {
                    this.notyf.success(res.message);
                    this.getIndicatorsForTable();

                    this.indicatorService.savePlanningIndicator({
                        id: res.result.id,
                        name: res.result.name
                    })

                    

                } else {
                    this.notyf.error(res.message);
                }
            });
    }

    clearForm() {
        this.indicator?.setValue('');
    }

    get totalPages(): number {
        return Math.ceil(this.list_indicators.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.list_indicators.slice(startIndex, endIndex);
    }

    pageChanged(pageNumber: number) {
        this.currentPage = pageNumber;
        this.calculatePagedItems();
    }


    get indicator() {
        return this.planningAddIndicator.get('indicator');
    }


    get update_indicator() {
        return this.planningUpdateIndicator.get('update_indicator');
    }


}
