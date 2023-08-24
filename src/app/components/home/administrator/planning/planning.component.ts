import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Course } from 'src/app/models/Course';
import { CourseService } from 'src/app/services/teacher/course.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlanningService } from 'src/app/services/admin/planning.service';

import { firstValueFrom, lastValueFrom } from 'rxjs';
import { UnitService } from 'src/app/services/admin/unit.service';
import { AttitudeService } from 'src/app/services/admin/attitude.service';
import { SkillService } from 'src/app/services/admin/skill.service';


@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {
    
    id_objective: number = 0
    selectedItem: any;

    list_filter_courses: any = []
    list_filter_subjects: any = []
    list_filter_units: any = []

    rowData: any = []

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 10; // Elementos por página

    selectItem(id: string) {
        this.selectedItem = this.rowData.find((item: any) => item.id === id);
    }


    planningAddForm = new FormGroup({
        select_filter_course: new FormControl(),
        select_filter_subject: new FormControl(),
        select_filter_unit: new FormControl()
    });

    constructor(
        private skillService: SkillService,
        private attitudeService: AttitudeService,
        private courseService: CourseService,
        private planningService: PlanningService,
        private unitService: UnitService,
        private formBuilder: FormBuilder) {
    }


    ngOnInit(): void {
        this.planningAddForm = this.formBuilder.group(
            {
                select_filter_course: [''],
                select_filter_subject: [''],
                select_filter_unit: ['']
            })

        // this.loadPlannings()
        this.loadFilterCourses()
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

    async loadPlannings(unit?: number): Promise<void> {
        const list_plannings = [];

        try {
            const plannings: any = await lastValueFrom(this.planningService.getAllPlanning(unit));

            if (plannings.length === 0) {
                this.rowData = [];
            }

            for (let planning of plannings) {
                const list_subobjectives = await firstValueFrom(this.planningService.getIdSubObjective(planning.id_objective));
                const list_skills = await firstValueFrom(this.skillService.getIdSkill(planning.id_unit));
                const list_attitudes = await firstValueFrom(this.attitudeService.getIdAttitude(planning.id_unit));
                const list_indicators = await firstValueFrom(this.planningService.getIdIndicator(planning.id_objective));

                // console.log(list_indicators)
                console.log(list_subobjectives)

                const indicatorsForThisPlanning = Object.values(list_indicators).filter((indicator: any) => indicator.id_objective === planning.id_objective);
                const indicator = indicatorsForThisPlanning.map((indicator: any) => {
                    return this.truncateChar(indicator.name)
                });

                const subobjectivesForThisPlanning = Object.values(list_subobjectives).filter((subobjective: any) => subobjective.id_objective === planning.id_objective);
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

    truncateChar(text: string): string {
        let charlimit = 100;
        if (!text || text.length <= charlimit) {
            return text;
        }
        let without_html = text.replace(/<(?:.|\n)*?>/gm, '');
        let shortened = without_html.substring(0, charlimit) + '...';
        return shortened;
    }

    get totalPages(): number {
        return Math.ceil(this.rowData.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.rowData.slice(startIndex, endIndex);
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
}
