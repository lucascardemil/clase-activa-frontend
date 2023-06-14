import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Course } from 'src/app/models/Course';
import { CourseService } from 'src/app/services/teacher/course.service';
import { SubjectService } from 'src/app/services/teacher/subject.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/services/teacher/planning.service';


import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { UnitService } from 'src/app/services/teacher/unit.service';


@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

    list_objectives: any = []
    
    list_skills: any = []
    list_attitudes: any = []
    select_units: any = []
    checkbox_objectives_indicators: any = []
    disabled: boolean = true
    text_indicator: string = ''
    text_skill: string = ''
    text_attitude: string = ''
    id_objective: number = 0
    
    selectedItem: any;
    checkboxs: any = []

    list_filter_courses: any = []
    list_filter_subjects: any = []
    list_filter_units: any = []

    rowData: any = []

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 10; // Elementos por página


    @ViewChildren('stickyElement')
    stickyElements!: QueryList<ElementRef>;

    selectItem(id: string) {
        this.selectedItem = this.rowData.find((item: any) => item.id === id);
    }


    planningAddForm = new FormGroup({
        indicator: new FormControl(),
        select_unit: new FormControl(),
        objective_indicator: new FormControl(),
        skill_unit: new FormControl(),
        attitude_unit: new FormControl(),
        select_filter_course: new FormControl(),
        select_filter_subject: new FormControl(),
        select_filter_unit: new FormControl()
    });

    constructor(
        private courseService: CourseService,
        private planningService: PlanningService,
        private unitService: UnitService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder) {
    }


    ngOnInit(): void {
        this.planningAddForm = this.formBuilder.group(
            {
                indicator: ['', [Validators.required]],
                objective_indicator: ['', [Validators.required]],
                skill_unit: ['', [Validators.required]],
                attitude_unit: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
                select_filter_course: [''],
                select_filter_subject: [''],
                select_filter_unit: ['']
            })

        this.loadPlannings()
        this.loadAttitudes()
        this.loadFilterCourses()
        this.loadSkills()
        this.calculatePagedItems()
    }


    loadFilterCourses() {
        this.list_filter_courses = []
        this.courseService.getCourse().subscribe((courses: any) => {
            courses.map((course: Course) => {
                this.list_filter_courses.push({
                    id: course.id,
                    name: course.name
                })
            })
        })
    }

    loadFilterSubjects(event: any) {
        this.list_filter_subjects = this.unitService.loadSubjects(event);
    }

    loadFilterUnits(event: any) {
        this.list_filter_units = this.unitService.loadUnits(event);
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


    loadAttitudes() {
        this.list_attitudes = []
        let table = 'attitudes'
        this.planningService.getIdPlanning(table).subscribe((attitudes: any) => {
            attitudes.map((attitude: any) => {
                this.list_attitudes.push({
                    id: attitude.id,
                    oa: 'OAA' + attitude.oa,
                    name: attitude.name
                })
            })
        })
    }

    loadCheckBoxIndicatorsUnit(id: any) {
        this.checkbox_objectives_indicators = []
        this.planningService.getIdObjective(id).subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.checkbox_objectives_indicators.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name
                })
            })
        })
    }


    onInputUnitsIndicators(event: any) {
        let val = event.target.value;
        let opts_units = event.target.list.childNodes;
        for (let i = 0; i < opts_units.length; i++) {
            if (opts_units[i].value === val) {
                this.loadCheckBoxIndicatorsUnit(opts_units[i].id);
                break;
            }
        }
    }

    async loadPlannings(unit?: number): Promise<void> {
        const list_plannings = [];

        try {
            const plannings: any = await lastValueFrom(this.planningService.getAllPlanning(unit));

            if (plannings.length === 0) {
                this.rowData = [];
            }

            for (let planning of plannings) {
                const list_subobjectives = await firstValueFrom(this.planningService.getIdSubObjective(planning.id_objective));
                const list_skills = await firstValueFrom(this.planningService.getIdSkill(planning.id_unit));
                const list_attitudes = await firstValueFrom(this.planningService.getIdAttitude(planning.id_unit));
                const list_indicators = await firstValueFrom(this.planningService.getIdIndicator(planning.id_objective, planning.id_unit));

                const indicatorsForThisPlanning = Object.values(list_indicators).filter((indicator: any) => indicator.objective === planning.id_objective && indicator.unit === planning.id_unit);
                const indicator = indicatorsForThisPlanning.map((indicator: any) => {
                    return this.truncateChar(indicator.name)
                });

                const subobjectivesForThisPlanning = Object.values(list_subobjectives).filter((subobjective: any) => subobjective.objective === planning.id_objective);
                const subobjective = subobjectivesForThisPlanning.reduce((result, item) => {
                    const { oa, name, name_subobjective, objective } = item;
                    const existingItem = result.find((obj: any) => obj.oa === oa);
                    if (existingItem) {
                        existingItem.subobjective.push(name_subobjective);
                    } else {
                        result.push({
                            oa,
                            name,
                            subobjective: [name_subobjective],
                            objective
                        });
                    }
                    return result;
                }, []);

                const skillsForThisPlanning = Object.values(list_skills).filter((skill: any) => skill.unit === planning.id_unit);
                const skill = skillsForThisPlanning.map((skill: any) => {
                    return {
                        'oa': skill.oa,
                        'name': [this.truncateChar(skill.name)]
                    }
                });

                const attitudesForThisPlanning = Object.values(list_attitudes).filter((attitude: any) => attitude.unit === planning.id_unit);
                const attitude = attitudesForThisPlanning.map((attitude: any) => {
                    return {
                        'oa': attitude.oa,
                        'name': [this.truncateChar(attitude.name)]
                    }
                });

                list_plannings.push({
                    curso: planning.course,
                    asignatura: planning.subject,
                    unidad: planning.unit,
                    eje: planning.axi,
                    objetivo: subobjective,
                    indicador: indicator,
                    habilidad: skill,
                    actitud: attitude,
                    id_objetivo: planning.id_objective,
                    id: planning.id_temporal,
                    id_axi: planning.id_axi,
                    id_unit: planning.id_unit
                });
            }

            this.rowData = this.groupObjectives(list_plannings);

            this.calculatePagedItems();

        } catch (error) {
            console.log(error);
        }
    }

    groupObjectives(data: any[]) {
        return data.reduce((result: any, element: any) => {
            const objectiveExisting = result.find(
                (obj: any) => obj.id_unit === element.id_unit && obj.id_axi === element.id_axi
            );

            if (objectiveExisting) {
                objectiveExisting.objetivo.push(...element.objetivo);
            } else {
                result.push({ ...element, objetivo: [...element.objetivo] });
            }

            result.forEach((obj: any) => {
                obj.objetivo.sort((a: any, b: any) => a.oa - b.oa);
            });

            return result;
        }, []);
    }

    async searchPlannings(id: number) {
        await this.loadPlannings(id);
        this.calculatePagedItems();
    }

    

    savePlanningUnitSkill(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.listUnits(planning.unit)
        })

        this.planningService.addPlanningUnitSkill(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                await this.loadPlannings();

                this.planningAddForm.patchValue({ skill_unit: false });
                this.planningAddForm.patchValue({ select_unit: '' });
                this.checkboxs = []
            }
        });
    }

    savePlanningUnitAttitude(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.listUnits(planning.unit)
        })

        this.planningService.addPlanningUnitAttitude(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                await this.loadPlannings();

                this.planningAddForm.patchValue({ attitude_unit: false });
                this.planningAddForm.patchValue({ select_unit: '' });
                this.checkboxs = []
            }
        });
    }

    savePlanningObjectiveIndicator(planning: any) {
        this.checkboxs.map((element: any) => {
            element.indicator = planning.indicator
            element.unit = this.listUnits(planning.unit)
        })

        this.planningService.addPlanningObjectiveIndicator(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El OA' + record.oa + ' con el indicador fue creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El OA' + record.oa + ' con el indicador ya está creado!');
                });

                await this.loadPlannings();

                this.planningAddForm.patchValue({ objective_indicator: false });
                this.planningAddForm.patchValue({ select_unit: '' });
                this.planningAddForm.patchValue({ indicator: '' });
                this.checkboxs = []
                this.checkbox_objectives_indicators = []
            }
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
            this.text_indicator = ''
            this.text_skill = ''
        }

    }

    previewIndicators(name: string) {
        this.text_indicator = name
    }

    previewSkill(name: string) {
        this.text_skill = name
    }

    previewAttitude(name: string) {
        this.text_attitude = name
    }


    disabledButton(planning: any) {
        const result = planning.every((elemento: any) => {
            return Boolean(elemento);
        });

        return !result;
    }

    clearForm() {
        this.indicator?.setValue('');
        this.checkboxs = [];
    }

    listUnits(name: any) {
        let list = this.select_units.filter((x: any) => x.name === name)[0];
        return list.id;
    }

    listAttitudes(name: any) {
        let list = this.list_attitudes.filter((x: any) => x.name === name)[0];
        return list.id;
    }

    truncateChar(text: string): string {
        let charlimit = 100;
        if (!text || text.length <= charlimit) {
            return text;
        }
        let without_html = text.replace(/<(?:.|\n)*?>/gm, '');
        let shortened = without_html.substring(0, charlimit) + '...';
        return shortened;
    }

    onScroll(event: any) {
        const maxScrollTop = event.target.scrollHeight - event.target.clientHeight;
        let scrollTop = event.target.scrollTop;
        this.stickyElements.forEach(stickyElement => {
            stickyElement.nativeElement.style.top = `${Math.min(scrollTop, maxScrollTop)}px`;
        });
    }

    get totalPages(): number {
        return Math.ceil(this.rowData.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.rowData.slice(startIndex, endIndex);
        console.log(this.pagedItems)
    }

    pageChanged(pageNumber: number) {
        this.currentPage = pageNumber;
        this.calculatePagedItems();
    }

    async clearFilter() {
        await this.loadPlannings();
        this.calculatePagedItems();
        this.planningAddForm.patchValue({ select_filter_course: '' });
        this.planningAddForm.patchValue({ select_filter_subject: '' });
        this.planningAddForm.patchValue({ select_filter_unit: '' });
    }


    get indicator() {
        return this.planningAddForm.get('indicator');
    }

    
    get select_unit() {
        return this.planningAddForm.get('select_unit');
    }


    get skill_unit() {
        return this.planningAddForm.get('skill_unit');
    }

    get attitude_unit() {
        return this.planningAddForm.get('attitude_unit');
    }

    get objective_indicator() {
        return this.planningAddForm.get('objective_indicator');
    }
}
