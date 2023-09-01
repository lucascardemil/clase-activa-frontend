import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AttitudeService } from 'src/app/services/admin/attitude.service';
import { AxiService } from 'src/app/services/admin/axi.service';
import { SkillService } from 'src/app/services/admin/skill.service';
import { UnitService } from 'src/app/services/admin/unit.service';
import { CourseService } from 'src/app/services/teacher/course.service';
import { SubjectService } from 'src/app/services/teacher/subject.service';

@Component({
    selector: 'app-unit-planner',
    templateUrl: './unit-planner.component.html',
    styleUrls: ['./unit-planner.component.css']
})
export class UnitPlannerComponent implements OnInit {

    list_subjects_planner: any = []
    list_courses_planner: any = []
    list_units_planner: any = []
    list_axis_planner: any = []
    list_skills_planner: any = []
    list_attitudes_planner: any = []
    search_table: any = []

    formPlanner = new FormGroup({
        select_subject_planner: new FormControl(),
        select_course_planner: new FormControl(),
        letter: new FormControl(),
        select_unit_planner: new FormControl(),
        select_axi_planner: new FormControl(),
        weekly_hours: new FormControl(),
        teacher: new FormControl(),
        concepts: new FormControl(),
        select_skill_planner: new FormControl(),
        select_attitude_planner: new FormControl()
    });

    constructor(
        private formBuilder: FormBuilder,
        private subjectservice: SubjectService,
        private courseservice: CourseService,
        private unitservice: UnitService,
        private axiservice: AxiService,
        private skillservice: SkillService,
        private attitudeservice: AttitudeService
    ) { }

    ngOnInit(): void {
        this.formPlanner = this.formBuilder.group(
            {
                select_subject_planner: [''],
                select_course_planner: [''],
                letter: [''],
                select_unit_planner: [''],
                select_axi_planner: [''],
                weekly_hours: [''],
                teacher: [''],
                concepts: [''],
                select_skill_planner: [''],
                select_attitude_planner: ['']
            })
        this.loadAllSubjects();
    }

    loadAllSubjects() {
        this.list_subjects_planner = []
        this.subjectservice.getSubject().subscribe((subjects: any) => {
            const uniqueNames: any = {};
            this.list_subjects_planner = subjects.filter((obj: any) => {
                if (!uniqueNames[obj.name]) {
                    uniqueNames[obj.name] = true;
                    return true;
                }
                return false;
            });
        })
    }

    searchCourse(event: any) {
        let subject = event.target.value
        this.list_courses_planner = []
        this.list_units_planner = []

        this.courseservice.getCourseForSubjectName(subject).subscribe((courses: any) => {
            courses.map((course: any) => {
                this.list_courses_planner.push({
                    id: course.id,
                    name: course.name,
                })
            })
        })

        this.unitservice.getUnitForSubjectName(subject).subscribe((units: any) => {
            units.map((unit: any) => {
                this.list_units_planner.push({
                    id: unit.id,
                    name: unit.name
                })
            })
        })
    }


    searchSkillAttitude(event: any) {
        let unit = parseInt(event.target.value)
        this.list_skills_planner = []
        this.list_attitudes_planner = []
        this.list_axis_planner = []


        const { id } = this.list_units_planner.find((item: any) => item.id === unit);
        this.axiservice.getAxiForSubjectAndCourse(id).subscribe((axis: any) => {
            axis.map((axi: any) => {
                this.list_axis_planner.push({
                    id: axi.id,
                    name: axi.name
                })
            })
        })

        this.skillservice.getIdSkill(unit).subscribe((skills: any) => {
            skills.map((skill: any) => {
                this.list_skills_planner.push({
                    id: skill.id,
                    oa: skill.oa,
                    name: skill.name
                })
            })
        })

        this.attitudeservice.getIdAttitude(unit).subscribe((attitudes: any) => {
            attitudes.map((attitude: any) => {
                this.list_attitudes_planner.push({
                    id: attitude.id,
                    oa: attitude.oa,
                    name: attitude.name
                })
            })
        })
    }

    checkAxi(event: any) {
        let id = parseInt(event.target.id)

        if (event.target.checked === true) {
            this.search_table.push({
                id: id,
            })

        } else {
            this.search_table = this.search_table.filter((element: any) => element.id !== id)
        }

        console.log(this.search_table)
    }

}
