import { Injectable } from '@angular/core';
import { SubjectService } from './subject.service';
import { Subject } from 'src/app/models/Subject';
import { Level } from 'src/app/models/Level';
import { Course } from 'src/app/models/Course';
import { CourseService } from './course.service';
import { PlanningService } from './planning.service';

@Injectable({
    providedIn: 'root'
})
export class UnitService {
    list_subjects: any = [];
    list_niveles: any = [];
    list_courses: any = [];
    list_units: any = [];
    savedPlanningUnit: any;

    constructor(
        private courseService: CourseService,
        private subjectService: SubjectService,
        private planningService: PlanningService
    ) { }

    loadLevels() {
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
        return this.list_niveles;
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

        return this.list_courses;
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

        return this.list_subjects;
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

        return this.list_units;
    }

    savePlanningUnit(planning: any) {
        this.savedPlanningUnit = planning;
    }
}
