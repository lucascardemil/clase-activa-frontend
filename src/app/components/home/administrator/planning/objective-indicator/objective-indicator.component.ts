import { Component, DoCheck, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PlanningComponent } from '../planning.component';
import { PlanningService } from 'src/app/services/admin/planning.service';


import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IndicatorService } from 'src/app/services/admin/indicator.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { ObjectiveService } from 'src/app/services/admin/objective.service';

@Component({
    selector: 'app-objective-indicator',
    templateUrl: './objective-indicator.component.html',
    styleUrls: ['./objective-indicator.component.css']
})
export class ObjectiveIndicatorComponent implements OnInit, DoCheck {

    select_indicators: any = []
    list_objectives: any = []
    list_objectives_indicators: any = []
    list_update_objectives_indicators: any = []
    checkboxs: any = []
    text_objective: string = ''
    list_preview_indicators: any = []
    savedPlanningObjective: any
    savedPlanningIndicator: any;
    list_table: any[] = []

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    planningAddObjectiveIndicator = new FormGroup({
        select_indicator: new FormControl(),
        objective: new FormControl()
    });

    planningUpdateObjectiveIndicator = new FormGroup({
        update_indicator: new FormControl(),
        update_objective: new FormControl()
    });

    constructor(
        public resourcesService: ResourcesService,
        private objectiveService: ObjectiveService,
        private indictorService: IndicatorService,
        private planningComponent: PlanningComponent,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {

        this.planningAddObjectiveIndicator = this.formBuilder.group(
            {
                select_indicator: ['', [Validators.required]],
                objective: ['', [Validators.required]]
            })

        this.planningUpdateObjectiveIndicator = this.formBuilder.group(
            {
                update_id: 0,
                update_select_indicator: ['', [Validators.required]],
                update_objective: ['', [Validators.required]]
            })
        this.selectIndicators();
        this.loadObjectives();
        this.getIndicatorForTable();
    }

    ngDoCheck(): void {
        this.resourcesService.datalist(this.indictorService.savedPlanningIndicator, this.savedPlanningIndicator, this.select_indicators);
        this.resourcesService.datalist(this.objectiveService.savedPlanningObjective, this.savedPlanningObjective, this.list_objectives_indicators);
    }

    getIndicatorForTable() {
        this.indictorService.getSelectIndicatorsObjectives().subscribe((data) => {
            this.list_table = this.groupObjectivesTable(data);
            this.calculatePagedItems();
        });
    }

    editObjectiveIndicator(data: any) {
        this.planningUpdateObjectiveIndicator.get('id')?.setValue(data.id);

        let selectedIndicator = this.select_indicators.find((item: any) => item.id === data.id_indicator).name;
        this.planningUpdateObjectiveIndicator.get('update_select_indicator')?.setValue(selectedIndicator);

        this.checkboxs = [];

        for (let objective of data.objectives) {
            let edit_selected = this.list_update_objectives_indicators.find((item: any) => item.id === objective.id_objective);
            if (edit_selected) {
                edit_selected.checked = true;
                this.checkboxs.push({
                    id: edit_selected.id,
                    checked: edit_selected.checked
                })
            }
        }

        for (let objective of this.list_update_objectives_indicators) {
            let edit_deselect = data.objectives.find((item: any) => item.id_objective === objective.id);
            if (!edit_deselect) {
                objective.checked = false;
            }
        }
    }

    async savePlanningObjectiveIndicator(data: any) {
        this.checkboxs.map((element: any) => {
            element.indicator = this.resourcesService.list(data.indicator, this.select_indicators)
        });

        this.indictorService.addPlanningIndicator(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El OA' + record.oa + ' con el indicador fue creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El OA' + record.oa + ' con el indicador ya está creado!');
                });
                
                this.getIndicatorForTable();

                this.planningAddObjectiveIndicator.patchValue({ objective: false });
                this.planningAddObjectiveIndicator.patchValue({ select_indicator: '' });
                this.checkboxs = []
            }
        });
        
    }


    async updatePlanningIndicator(data: any) {
        this.checkboxs.map((element: any) => {
            element.indicator = this.resourcesService.list(data.indicator, this.select_indicators)
        });

        this.indictorService.updatePlanningIndicator(this.checkboxs).subscribe((res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El OA' + record.oa + ' con el indicador fue creado con exito!');
                });


                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El OA' + record.oa + ' con el indicador ya está creado!');
                });

                this.getIndicatorForTable();
                this.checkboxs = []
            }
        });
        
    }

    selectIndicators() {
        this.select_indicators = []
        this.indictorService.getSelectIndicators().subscribe((indicators: any) => {
            indicators.map((indicator: any) => {
                this.select_indicators.push({
                    id: indicator.id,
                    name: indicator.name.replace(/\n/g, "")
                })
            })
        })
    }

    loadObjectives() {
        this.list_objectives_indicators = []
        this.list_update_objectives_indicators = []
        this.planningService.getIdPlanning('objectives').subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.list_objectives_indicators.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name,
                    checked: false
                })

                this.list_update_objectives_indicators.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name,
                    checked: false
                })
            })
        })
    }

    checkBox(event: any) {
        let id = parseInt(event.target.id)

        if (event.target.checked === true) {
            this.checkboxs.push({
                id: id,
                checked: true
            })

            let selected = this.list_update_objectives_indicators.find((item: any) => item.id === id);
            if (selected) {
                selected.checked = true;
            }

        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== id)
            this.text_objective = ''

            let deselect = this.list_update_objectives_indicators.find((item: any) => item.id === id);
            if (deselect) {
                deselect.checked = false;
                this.checkboxs.push({
                    id: deselect.id,
                    checked: deselect.checked
                })
            }
        }
    }

    previewObjectiveIndicators(objective: number, name: string) {
        this.text_objective = name
        this.indictorService.getPreviewIndicator(objective).subscribe((objectives: any) => this.list_preview_indicators = objectives)
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


    groupObjectivesTable(data: any) {
        const result: any[] = [];
        const seenIds = new Set();

        data.forEach((item: any) => {
            const id_indicator = item.id_indicator;
            if (!seenIds.has(id_indicator)) {
                seenIds.add(id_indicator);
                result.push({
                    id_indicator: id_indicator,
                    name_indicator: item.name,
                    objectives: []
                });
            }

            result.forEach(res => {
                if (res.id_indicator === id_indicator) {
                    res.objectives.push({
                        id_objective: item.id_objective,
                        oa: item.oa,
                        checked: false
                    });
                }
            });
        });

        return result;
    }

    get select_indicator() {
        return this.planningAddObjectiveIndicator.get('select_indicator');
    }

    get objective() {
        return this.planningAddObjectiveIndicator.get('objective');
    }

    get update_select_indicator() {
        return this.planningUpdateObjectiveIndicator.get('update_select_indicator');
    }

    get update_objective() {
        return this.planningUpdateObjectiveIndicator.get('update_objective');
    }
}
