import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/services/teacher/planning.service';

@Component({
    selector: 'app-edit-planning',
    templateUrl: './edit-planning.component.html',
    styleUrls: ['./edit-planning.component.css']
})
export class EditPlanningComponent implements OnInit {
    @Input() modalId!: string;
    @Input() selectedItem: any[] = [];
    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;
    select_edit_axis: any = []
    list_edit_objectives: any = []
    checkboxs: any = []


    text_objective: string = ''

    planningUpdateForm = new FormGroup({
        level: new FormControl(),
        course: new FormControl(),
        subject: new FormControl(),
        axi: new FormControl(),
        skill: new FormControl(),
        attitude: new FormControl(),
        objective: new FormControl(),
        unit: new FormControl(),
        indicator: new FormControl(),
        subObjective: new FormControl(),
        number_oa: new FormControl(),
        select_edit_axi: new FormControl(),
        select_unit: new FormControl(),
        objective_edit_axi: new FormControl(),
        objective_unit: new FormControl(),
        objective_indicator: new FormControl(),
        skill_unit: new FormControl(),
        attitude_unit: new FormControl(),
        number_oaa: new FormControl(),
        number_oah: new FormControl()
    });

    constructor(
        private formBuilder: FormBuilder,
        private planningService: PlanningService
    ) {
        this.planningUpdateForm = this.formBuilder.group(
            {
                level: ['', [Validators.required]],
                course: ['', [Validators.required]],
                subject: ['', [Validators.required]],
                axi: ['', [Validators.required]],
                skill: ['', [Validators.required]],
                attitude: ['', [Validators.required]],
                objective: [],
                unit: ['', [Validators.required]],
                indicator: ['', [Validators.required]],
                subObjective: ['', [Validators.required]],
                number_oa: ['', [Validators.required]],
                select_edit_axi: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
                objective_edit_axi: this.formBuilder.array([]),
                objective_unit: ['', [Validators.required]],
                objective_indicator: ['', [Validators.required]],
                skill_unit: ['', [Validators.required]],
                attitude_unit: ['', [Validators.required]],
                number_oaa: ['', [Validators.required]],
                number_oah: ['', [Validators.required]]
            })

    }


    ngOnChanges(changes: SimpleChanges) {
        this.checkboxs = []
        for (let control of this.objective_edit_axi.controls) {
            control.setValue(false);
        }
        if (changes['selectedItem']) {
            if (this.selectedItem !== undefined) {
                console.log(this.selectedItem)
                for (let key in this.selectedItem) {
                    if (key === 'id_axi') {
                        let selectedValue = this.select_edit_axis.find((item: any) => item.id === this.selectedItem[key]).name;
                        this.planningUpdateForm.get('select_edit_axi')?.setValue(selectedValue);
                    }
                    if (key === 'objetivo') {
                        for (let objective of this.selectedItem[key]) {
                            let selectedValueIndex = this.list_edit_objectives.findIndex((item: any) => item.id === objective.objective);
                            this.objective_edit_axi.controls[selectedValueIndex].setValue(true);

                            let selectedValue = this.list_edit_objectives.find((item: any) => item.id === objective.objective);
                            this.text_objective = selectedValue.name;
                            this.checkboxs.push({
                                id: String(selectedValue.id)
                            })
                        }
                    }
                }
            }
        }
    }

    ngOnInit(): void {

        // this.editData();
        this.loadEditAxis();
        this.loadEditObjectives();


    }

    updatePlanningAxiObjective(planning: any) {
        console.log(planning)

        // this.checkboxs.map((element: any) => {
        //     element.axi = this.listAxis(planning.axi)
        // })

        // this.planningService.addPlanningAxiObjective(this.checkboxs).subscribe((res: any) => {
        //     if (res.status === 'success') {
        //         this.planningAddForm.patchValue({ objective_axi: false });
        //         this.planningAddForm.patchValue({ select_axi: '' });
        //         this.checkboxs = []

        //         const { insertedRecords, existingRecords } = res.result;
        //         this.loadPlannings();

        //         insertedRecords.forEach((record: any) => {
        //             this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
        //         });

        //         existingRecords.forEach((record: any) => {
        //             this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
        //         });
        //     }
        // });
    }

    loadEditAxis() {
        this.select_edit_axis = []
        this.planningService.getSelectAxis().subscribe((axis: any) => {
            axis.map((axi: any) => {
                this.select_edit_axis.push({
                    id: axi.id,
                    name: axi.subject + '/' + axi.name
                })
            })
        })
    }

    loadEditObjectives() {
        this.list_edit_objectives = [];
        let table = 'objectives';
        this.planningService.getIdPlanning(table).subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.list_edit_objectives.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name
                });

                this.objective_edit_axi.push(this.formBuilder.control(false));
            });
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
            this.text_objective = ''
        }

    }

    previewObjective(name: string) {
        this.text_objective = name
    }

    disabledButtonUpdate(planning: any) {
        const result = planning.every((elemento: any) => {
            return Boolean(elemento);
        });
        return !result;
    }

    get level() {
        return this.planningUpdateForm.get('level');
    }

    get course() {
        return this.planningUpdateForm.get('course');
    }

    get subject() {
        return this.planningUpdateForm.get('subject');
    }

    get axi() {
        return this.planningUpdateForm.get('axi');
    }

    get skill() {
        return this.planningUpdateForm.get('skill');
    }

    get attitude() {
        return this.planningUpdateForm.get('attitude');
    }

    get objective() {
        return this.planningUpdateForm.get('objective');
    }

    get unit() {
        return this.planningUpdateForm.get('unit');
    }

    get indicator() {
        return this.planningUpdateForm.get('indicator');
    }

    get subObjective() {
        return this.planningUpdateForm.get('subObjective');
    }

    get number_oa() {
        return this.planningUpdateForm.get('number_oa');
    }

    get select_edit_axi() {
        return this.planningUpdateForm.get('select_edit_axi');
    }

    get select_unit() {
        return this.planningUpdateForm.get('select_unit');
    }

    get objective_unit() {
        return this.planningUpdateForm.get('objective_unit');
    }

    get skill_unit() {
        return this.planningUpdateForm.get('skill_unit');
    }

    get attitude_unit() {
        return this.planningUpdateForm.get('attitude_unit');
    }

    get objective_edit_axi() {
        return this.planningUpdateForm.get('objective_edit_axi') as FormArray;
    }

    get objective_indicator() {
        return this.planningUpdateForm.get('objective_indicator');
    }

    get number_oaa() {
        return this.planningUpdateForm.get('number_oaa');
    }

    get number_oah() {
        return this.planningUpdateForm.get('number_oah');
    }

}
