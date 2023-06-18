import { Component, Inject, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/teacher/course.service';
import { PlanningService } from 'src/app/services/teacher/planning.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitService } from 'src/app/services/teacher/unit.service';

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

    list_niveles: any = []
    list_courses: any = []
    list_subjects: any = []

    planningAddUnit = new FormGroup({
        level: new FormControl(),
        course: new FormControl(),
        subject: new FormControl(),
        unit: new FormControl(),
        select_unit: new FormControl(),
    });

    constructor(
        private unitService: UnitService,
        private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.planningAddUnit = this.formBuilder.group(
            {
                level: ['', [Validators.required]],
                course: ['', [Validators.required]],
                subject: ['', [Validators.required]],
                unit: ['', [Validators.required]],
                select_unit: ['', [Validators.required]],
            })
        this.loadLevels()
    }

    loadLevels() {
        this.list_niveles = this.unitService.loadLevels();
    }

    loadCourses(event: any) {
        this.list_courses = this.unitService.loadCourses(event);
    }

    loadSubjects(event: any) {
        this.list_subjects = this.unitService.loadSubjects(event);
    }

    savePlanningUnit(planning: any) {
        this.planningService.addPlanningUnit(planning).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.unit?.setValue('');
                    this.notyf.success(res.message);

                    this.unitService.savePlanningUnit({
                        id: res.result.id,
                        name: res.result.level + '/' + res.result.course + '/' + res.result.subject + '/' + res.result.unit
                    });
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



    get level() {
        return this.planningAddUnit.get('level');
    }

    get course() {
        return this.planningAddUnit.get('course');
    }

    get subject() {
        return this.planningAddUnit.get('subject');
    }

    get unit() {
        return this.planningAddUnit.get('unit');
    }

}
