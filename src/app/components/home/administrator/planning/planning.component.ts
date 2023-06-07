import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subject } from 'src/app/models/Subject'
import { Course } from 'src/app/models/Course';
import { CourseService } from 'src/app/services/teacher/course.service';
import { SubjectService } from 'src/app/services/teacher/subject.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Level } from 'src/app/models/Level';
import { PlanningService } from 'src/app/services/teacher/planning.service';


import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { ColDef, GridOptions } from 'ag-grid-community';
import { firstValueFrom, lastValueFrom } from 'rxjs';




@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

    list_subjects: any = []
    list_all_subjects: any = []
    list_niveles: any = []
    list_courses: any = []
    list_all_courses: any = []
    list_objectives: any = []
    list_objectives_axis: any = []
    list_objectives_units: any = []
    list_objectives_subobjectives: any = []
    list_skills: any = []
    list_attitudes: any = []
    list_axis: any = []
    list_units: any = []
    select_axis: any = []
    select_units: any = []
    checkbox_objectives_indicators: any = []
    disabled: boolean = true
    text_objective: string = ''
    text_subobjective: string = ''
    text_indicator: string = ''
    text_skill: string = ''
    text_attitude: string = ''
    id_objective: number = 0
    list_preview_subobjectives: any = []
    selectedItem: any;
    checkboxs: any = []

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
        select_axi: new FormControl(),
        select_unit: new FormControl(),
        objective_axi: new FormControl(),
        objective_unit: new FormControl(),
        objective_indicator: new FormControl(),
        skill_unit: new FormControl(),
        attitude_unit: new FormControl(),
        number_oaa: new FormControl(),
        number_oah: new FormControl(),
        select_filter_course: new FormControl(),
        select_filter_subject: new FormControl(),
        select_filter_unit: new FormControl()
    });

    constructor(
        private subjectService: SubjectService,
        private courseService: CourseService,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder) {
    }


    async ngOnInit(): Promise<void> {
        this.planningAddForm = this.formBuilder.group(
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
                select_axi: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
                objective_axi: [],
                objective_unit: ['', [Validators.required]],
                objective_indicator: ['', [Validators.required]],
                skill_unit: ['', [Validators.required]],
                attitude_unit: ['', [Validators.required]],
                number_oaa: ['', [Validators.required]],
                number_oah: ['', [Validators.required]],
                select_filter_course: [''],
                select_filter_subject: [''],
                select_filter_unit: ['']
            })

        this.loadLevels()
        this.selectUnits()
        this.selectAxis()
        this.loadObjectives()
        this.loadAttitudes()
        this.loadAxis()
        await this.loadPlannings()
        this.loadAllSubjects()
        this.loadAllCourses()
        this.loadSkills()
        this.calculatePagedItems()
    }

    loadLevels() {
        this.list_niveles = []
        this.subjectService.getAllLevelsWithoutCourses().subscribe((niveles: any) => {
            niveles.map((nivel: Level) => {
                if (nivel.condition_level === 1) {
                    this.list_niveles.push({
                        id: nivel.id,
                        name: nivel.name
                    })
                }
            })
        })
    }

    loadCourses(event: any) {
        this.list_courses = []
        let id = event.target.value
        this.courseService.getCourseForLevel(id).subscribe((courses: any) => {
            courses.map((course: Course) => {
                this.list_courses.push({
                    id: course.id,
                    name: course.name
                })
            })
        })
    }

    loadAllCourses() {
        this.list_all_courses = []
        this.courseService.getCourse().subscribe((courses: any) => {
            courses.map((course: Course) => {
                this.list_all_courses.push({
                    id: course.id,
                    name: course.name
                })
            })
        })
    }

    loadSubjects(event: any) {
        this.list_subjects = []
        let id = event.target.value
        this.subjectService.getSubjectForCourse(id).subscribe((subjects: any) => {
            subjects.map((subject: Subject) => {
                this.list_subjects.push({
                    id: subject.id,
                    name: subject.name
                })
            })
        })
    }

    loadAllSubjects() {
        this.list_all_subjects = []
        this.subjectService.getSubject().subscribe((subjects: any) => {
            subjects.map((subject: Subject) => {
                this.list_all_subjects.push({
                    id: subject.id,
                    name: subject.name,
                    course: subject.course
                })
            })
        })
    }

    loadUnits(event: any) {
        this.list_units = []
        let id = event.target.value
        this.planningService.getSubjectForUnit(id).subscribe((units: any) => {
            units.map((unit: any) => {
                this.list_units.push({
                    id: unit.id,
                    name: unit.name
                })
            })
        })
    }

    selectUnits() {
        this.select_units = []
        this.planningService.getSelectUnits().subscribe((units: any) => {
            units.map((unit: any) => {
                this.select_units.push({
                    id: unit.id,
                    name: unit.level + '/' + unit.course + '/' + unit.subject + '/' + unit.unit
                })
            })
        })
    }

    selectAxis() {
        this.select_axis = []
        this.planningService.getSelectAxis().subscribe((axis: any) => {
            axis.map((axi: any) => {
                this.select_axis.push({
                    id: axi.id,
                    name: axi.subject + '/' + axi.name
                })
            })
        })
    }

    loadObjectives() {
        this.list_objectives_axis = []
        this.list_objectives_units = []
        this.list_objectives_subobjectives = []

        let table = 'objectives'
        this.planningService.getIdPlanning(table).subscribe((objectives: any) => {
            objectives.map((objective: any) => {

                this.list_objectives_axis.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name
                })

                this.list_objectives_units.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name
                })

                this.list_objectives_subobjectives.push({
                    id: objective.id,
                    oa: 'OA' + objective.oa,
                    name: objective.name
                })
            })
        })
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

    loadAxis() {
        this.list_axis = []
        let table = 'axis'
        this.planningService.getIdPlanning(table).subscribe((axis: any) => {
            axis.map((axi: any) => {
                this.list_axis.push({
                    id: axi.id,
                    name: axi.name
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

    async loadPlanningsForUnit(event: any) {
        let id = event.target.value
        await this.loadPlannings(id);
        this.calculatePagedItems();
    }

    savePlanningSubjectAxi(planning: any) {
        this.planningService.addPlaningSubjectAxi(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);

                this.planningService.getIdAxisSubjects(res.result.name, res.result.subject).subscribe((axis: any) => {
                    axis.map((axi: any) => {
                        this.select_axis.push({
                            id: axi.id,
                            name: axi.subject + '/' + axi.name
                        })
                    })
                })

            } else {
                this.notyf.error(res.message);
            }
        });
    }

    savePlanningObjective(planning: any) {
        this.planningService.addPlaningObjective(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);

                this.list_objectives.push({
                    id: res.result.id,
                    oa: 'OA' + res.result.oa,
                    name: res.result.name
                })
            } else {
                this.notyf.error(res.message);
            }
        });
    }

    savePlanningAttitude(planning: any) {
        this.planningService.addPlaningAttitude(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);

                this.list_attitudes.push({
                    id: res.result.id,
                    oa: 'OAA' + res.result.oa,
                    name: res.result.name
                })
            } else {
                this.notyf.error(res.message);
            }
        });
    }

    savePlanningSkill(planning: any) {
        this.planningService.addPlaningSkill(planning).subscribe((res: any) => {
            if (res.status === 'success') {
                this.subject?.setValue('');
                this.notyf.success(res.message);

                this.list_skills.push({
                    id: res.result.id,
                    oa: 'OAH' + res.result.oa,
                    name: res.result.name
                })
            } else {
                this.notyf.error(res.message);
            }
        });
    }


    savePlanningUnit(planning: any) {
        this.planningService.addPlanningUnit(planning).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.unit?.setValue('');
                    this.notyf.success(res.message);
                    this.select_units.push({
                        id: res.result.id,
                        name: res.result.level + '/' + res.result.course + '/' + res.result.subject + '/' + res.result.unit
                    })
                } else {
                    this.notyf.error(res.message);
                }
            });
    }

    savePlanningAxiObjective(planning: any) {

        this.checkboxs.map((element: any) => {
            element.axi = this.listAxis(planning.axi)
        })

        this.planningService.addPlanningAxiObjective(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');

                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                await this.loadPlannings();

                this.planningAddForm.patchValue({ objective_axi: false });
                this.planningAddForm.patchValue({ select_axi: '' });
                this.checkboxs = []
            }
        });
    }

    savePlanningUnitObjective(planning: any) {

        this.checkboxs.map((element: any) => {
            element.unit = this.listUnits(planning.unit)
        })

        this.planningService.addPlanningUnitObjective(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' y OA' + record.oa + ' se asociaron correctamente!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' y OA' + record.oa + ' ya están asociados!');
                });

                await this.loadPlannings();

                this.planningAddForm.patchValue({ objective_unit: false });
                this.planningAddForm.patchValue({ select_unit: '' });
                this.checkboxs = []
            }
        });
    }

    savePlanningSubObjective(planning: any) {

        this.checkboxs.map((element: any) => {
            element.subObjective = planning.subObjective
        })

        this.planningService.addPlanningSubObjective(this.checkboxs).subscribe(async (res: any) => {
            if (res.status === 'success') {
                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El OA' + record.name_oa + ' con el subjetivo fue creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El OA' + record.name_oa + ' con el subjetivo ya está creado!');
                });

                await this.loadPlannings();

                this.planningAddForm.patchValue({ objective_unit: false });
                this.planningAddForm.patchValue({ subObjective: '' });
                this.checkboxs = []
            }
        });
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
            this.text_objective = ''
            this.text_subobjective = ''
            this.text_indicator = ''
            this.text_skill = ''
        }

    }

    previewObjectiveSubObjectives(objective: number, name: string) {
        this.text_objective = name
        this.planningService.getIdSubObjective(objective).subscribe((objectives: any) => this.list_preview_subobjectives = objectives)
    }

    previewObjective(name: string) {
        this.text_objective = name
    }

    previewSubObjective(name: string) {
        this.text_subobjective = name
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
        this.level?.setValue('');
        this.course?.setValue('');
        this.subject?.setValue('');
        this.unit?.setValue('');
        this.axi?.setValue('');
        this.skill?.setValue('');
        this.objective?.setValue('');
        this.subObjective?.setValue('');
        this.indicator?.setValue('');
        this.attitude?.setValue('');
        this.number_oa?.setValue('');
        this.number_oaa?.setValue('');
        this.number_oah?.setValue('');
        this.checkboxs = [];
    }

    listUnits(name: any) {
        let list = this.select_units.filter((x: any) => x.name === name)[0];
        return list.id;
    }

    listAxis(name: any) {
        let list = this.select_axis.filter((x: any) => x.name === name)[0];
        return list.id;
    }

    listAttitudes(name: any) {
        let list = this.list_attitudes.filter((x: any) => x.name === name)[0];
        return list.id;
    }

    createListTable(columns: any[], title: string) {

        let container = document.createElement('div');

        for (let i = 0; i < columns.length; i++) {
            let div = document.createElement('div');
            if (title === 'objective') {
                div.textContent = 'OA' + columns[i].title;
                container.appendChild(div);
            }

            if (title === 'attitude') {
                div.textContent = 'OAA' + columns[i].title;
                container.appendChild(div);
            }

            if (title === 'skill') {
                div.textContent = 'OAH' + columns[i].title;
                container.appendChild(div);
            }

            if (title === 'indicator') {
                div.textContent = columns[i].title;
                container.appendChild(div);
            }


            if (columns[i].subtitle !== undefined) {

                let ul = document.createElement('ul');
                let li = document.createElement('li');
                li.textContent = columns[i].subtitle;
                ul.appendChild(li);
                container.appendChild(ul);
            }
        }

        return container

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


    get level() {
        return this.planningAddForm.get('level');
    }

    get course() {
        return this.planningAddForm.get('course');
    }

    get subject() {
        return this.planningAddForm.get('subject');
    }

    get axi() {
        return this.planningAddForm.get('axi');
    }

    get skill() {
        return this.planningAddForm.get('skill');
    }

    get attitude() {
        return this.planningAddForm.get('attitude');
    }

    get objective() {
        return this.planningAddForm.get('objective');
    }

    get unit() {
        return this.planningAddForm.get('unit');
    }

    get indicator() {
        return this.planningAddForm.get('indicator');
    }

    get subObjective() {
        return this.planningAddForm.get('subObjective');
    }

    get number_oa() {
        return this.planningAddForm.get('number_oa');
    }

    get select_axi() {
        return this.planningAddForm.get('select_axi');
    }

    get select_unit() {
        return this.planningAddForm.get('select_unit');
    }

    get objective_unit() {
        return this.planningAddForm.get('objective_unit');
    }

    get skill_unit() {
        return this.planningAddForm.get('skill_unit');
    }

    get attitude_unit() {
        return this.planningAddForm.get('attitude_unit');
    }

    get objective_axi() {
        return this.planningAddForm.get('objective_axi');
    }

    get objective_indicator() {
        return this.planningAddForm.get('objective_indicator');
    }

    get number_oaa() {
        return this.planningAddForm.get('number_oaa');
    }

    get number_oah() {
        return this.planningAddForm.get('number_oah');
    }
}
