import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'src/app/models/Subject'
import { Course } from 'src/app/models/Course';
import { CourseService } from 'src/app/services/teacher/course.service';
import { SubjectService } from 'src/app/services/teacher/subject.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Level } from 'src/app/models/Level';
import { PlanningService } from 'src/app/services/teacher/planning.service';


import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';

@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

    list_subjects: any = []
    list_niveles: any = []
    list_courses: any = []
    list_units: any = []
    list_axis: any = []
    list_objectives: any = []
    list_skills: any = []
    list_plannings: any = []
    disabled: boolean = true

    pages: number = 1;

    plannigAddForm = new FormGroup({
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
    });

    constructor(
        private subjectService: SubjectService,
        private courseService: CourseService,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.plannigAddForm = this.formBuilder.group(
            {
                level: ['', [Validators.required]],
                course: ['', [Validators.required]],
                subject: ['', [Validators.required]],
                axi: ['', [Validators.required]],
                skill: ['', [Validators.required]],
                attitude: ['', [Validators.required]],
                objective: ['', [Validators.required]],
                unit: ['', [Validators.required]],
                indicator: ['', [Validators.required]],
                subObjective: ['', [Validators.required]],
            })

        this.loadLevels()
        this.loadUnits()
        this.loadAxis()
        this.loadObjectives()
        this.loadPlannings()
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

    loadUnits() {
        this.list_units = []
        let table = 'units'
        this.planningService.getIdPlanning(table).subscribe((units: any) => {
            units.map((unit: any) => {
                this.list_units.push({
                    id: unit.id,
                    name: unit.name
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

    loadObjectives() {
        this.list_objectives = []
        let table = 'objectives'
        this.planningService.getIdPlanning(table).subscribe((objectives: any) => {
            objectives.map((objective: any) => {
                this.list_objectives.push({
                    id: objective.id,
                    name: objective.name
                })
            })
        })
    }

    loadPlannings() {
        this.list_plannings = []
        this.planningService.getAllPlanning().subscribe((plannings: any) => {
            plannings.map((planning: any) => {
                this.planningService.getIdSubObjective(planning.id).subscribe((subobjectives: any) => {
                    this.list_plannings.push({
                        course: planning.course,
                        subject: planning.subject,
                        unit: planning.unit,
                        axi: planning.axi,
                        objective: planning.objective,
                        subObjective: subobjectives,
                        indicator: planning.indicator
                    })

                    console.log(this.list_plannings)
                })
            })
        })
    }

    savePlanningUnit(planning: any) {
        this.planningService.addPlaningUnit(planning).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.clearForm();
                    this.notyf.success(res.message);
                    this.list_units.push({ id: res.result.id, name: res.result.name })
                } else {
                    this.notyf.error(res.message);
                }
            });
    }


    savePlanningObjective(planning: any) {

        planning = { name: planning.name, unit: this.listUnits(planning.unit), axi: this.listAxis(planning.axi) }

        this.planningService.addPlanningObjective(planning).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.clearForm();
                    this.notyf.success(res.message);
                    this.list_objectives.push({ id: res.result.id, name: res.result.name })
                } else {
                    this.notyf.error(res.message);
                }
            });
    }

    savePlanningWithObjective(planning: any) {

        planning = { name: planning.name, objective: this.listObjectives(planning.objective), table: planning.table, message: planning.message }

        this.planningService.addPlanningWithObjective(planning).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.clearForm();
                    this.notyf.success(res.message);
                    this.loadObjectives();
                } else {
                    this.notyf.error(res.message);
                }
            });
    }


    savePlanningWithUnit(planning: any) {

        planning = { name: planning.name, unit: this.listUnits(planning.unit), table: planning.table, message: planning.message }

        this.planningService.addPlanningWithUnit(planning).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.clearForm();
                    this.notyf.success(res.message);
                    this.list_axis.push({ id: res.result.id, name: res.result.name })
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
    }

    listUnits(name: any) {
        let list = this.list_units.filter((x: any) => x.name === name)[0];
        return list.id;
    }

    listAxis(name: any) {
        let list = this.list_axis.filter((x: any) => x.name === name)[0];
        return list.id;
    }

    listObjectives(name: any) {
        let list = this.list_objectives.filter((x: any) => x.name === name)[0];
        return list.id;
    }


    get level() {
        return this.plannigAddForm.get('level');
    }

    get course() {
        return this.plannigAddForm.get('course');
    }

    get subject() {
        return this.plannigAddForm.get('subject');
    }

    get axi() {
        return this.plannigAddForm.get('axi');
    }

    get skill() {
        return this.plannigAddForm.get('skill');
    }

    get attitude() {
        return this.plannigAddForm.get('attitude');
    }

    get objective() {
        return this.plannigAddForm.get('objective');
    }

    get unit() {
        return this.plannigAddForm.get('unit');
    }

    get indicator() {
        return this.plannigAddForm.get('indicator');
    }

    get subObjective() {
        return this.plannigAddForm.get('subObjective');
    }

}
