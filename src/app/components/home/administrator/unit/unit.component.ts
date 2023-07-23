import { Component, Inject, OnInit } from '@angular/core';
import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UnitService } from 'src/app/services/admin/unit.service';
import { CourseService } from 'src/app/services/teacher/course.service';
import { SubjectService } from 'src/app/services/teacher/subject.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { PlanningComponent } from '../planning/planning.component';

@Component({
    selector: 'app-unit',
    templateUrl: './unit.component.html',
    styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

    list_niveles: any = []
    list_courses: any = []
    list_subjects: any = []
    list_units: any = []
    selectedLevelId: any = null;

    pagedItems: any[] = []; // Lista de elementos paginados

    currentPage: number = 1; // Página actual
    itemsPerPage: number = 5; // Elementos por página

    planningAddUnit = new FormGroup({
        level: new FormControl(),
        course: new FormControl(),
        subject: new FormControl(),
        unit: new FormControl(),
    });

    planningUpdateUnit = new FormGroup({
        update_level: new FormControl(),
        update_course: new FormControl(),
        update_subject: new FormControl(),
        update_unit: new FormControl(),
    });

    constructor(
        private planningComponent: PlanningComponent,
        public resourcesService: ResourcesService,
        private subjectService: SubjectService,
        private courseService: CourseService,
        private unitService: UnitService,
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
            })

        this.planningUpdateUnit = this.formBuilder.group(
            {
                id: [''],
                update_level: ['', [Validators.required]],
                update_course: ['', [Validators.required]],
                update_subject: ['', [Validators.required]],
                update_unit: ['', [Validators.required]],
            })
        this.loadLevels()
        this.getUnitsForTable()
    }

    getUnitsForTable() {
        this.unitService.getSelectUnits().subscribe((units) => {
            this.list_units = units;
            this.calculatePagedItems();
        });
    }

    loadLevels() {
        this.list_niveles = this.unitService.loadLevels();
    }

    loadCourses(event: any) {
        this.planningAddUnit.get('course')?.setValue('');
        this.planningUpdateUnit.get('update_course')?.setValue('');
        this.planningAddUnit.get('subject')?.setValue('');
        this.planningUpdateUnit.get('update_subject')?.setValue('');
        this.list_courses = this.unitService.loadCourses(event);
    }

    loadSubjects(event: any) {
        this.planningAddUnit.get('subject')?.setValue('');
        this.planningUpdateUnit.get('update_subject')?.setValue('');
        this.list_subjects = this.unitService.loadSubjects(event);
    }

    savePlanningUnit(planning: any) {
        this.unitService.addPlanningUnit(planning).subscribe(
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

    editUnit(unit: any) {
        this.planningUpdateUnit.get('id')?.setValue(unit.id);
        this.planningUpdateUnit.get('update_unit')?.setValue(unit.unit);
        this.editSelected(unit);
    }

    editSelected(unit: any) {
        const selectedLevel = this.list_niveles.find((level: any) => level.name === unit.level);
        if (selectedLevel) {
            this.planningUpdateUnit.get('update_level')?.setValue(selectedLevel.id);
            this.courseService.getCourseForLevel(selectedLevel.id).subscribe((courses: any) => {
                this.list_courses = courses.map((course: any) => ({
                    id: course.id,
                    name: course.name
                }));

                const selectedCourse = this.list_courses.find((course: any) => course.name === unit.course);
                if (selectedCourse) {
                    this.planningUpdateUnit.get('update_course')?.setValue(selectedCourse.id);
                    this.subjectService.getSubjectForCourse(selectedCourse.id).subscribe((subjects: any) => {
                        this.list_subjects = subjects.map((subject: any) => ({
                            id: subject.id,
                            name: subject.name
                        }));

                        const selectedSubject = this.list_subjects.find((subject: any) => subject.name === unit.subject);
                        if (selectedSubject) {
                            this.planningUpdateUnit.get('update_subject')?.setValue(selectedSubject.id);
                        }
                    });
                }
            });
        }
    }

    updatePlanningUnit(planning: any) {
        this.unitService.updatePlanningUnit(planning).subscribe(
            async (res: any) => {
                if (res.status === 'success') {
                    this.notyf.success(res.message);
                    this.getUnitsForTable();

                    this.unitService.savePlanningUnit({
                        id: res.result.id,
                        name: res.result.level + '/' + res.result.course + '/' + res.result.subject + '/' + res.result.unit
                    });

                    await this.planningComponent.loadPlannings();

                } else {
                    this.notyf.error(res.message);
                }
            });
    }


    get totalPages(): number {
        return Math.ceil(this.list_units.length / this.itemsPerPage);
    }

    calculatePagedItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.pagedItems = this.list_units.slice(startIndex, endIndex);
    }

    pageChanged(pageNumber: number) {
        this.currentPage = pageNumber;
        this.calculatePagedItems();
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

    get update_level() {
        return this.planningUpdateUnit.get('update_level');
    }

    get update_course() {
        return this.planningUpdateUnit.get('update_course');
    }

    get update_subject() {
        return this.planningUpdateUnit.get('update_subject');
    }

    get update_unit() {
        return this.planningUpdateUnit.get('update_unit');
    }

}
