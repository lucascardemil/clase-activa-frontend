import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { AuthGuard } from './guards/auth.guard';

import { AlumnoComponent } from './components/home/alumno/alumno.component';
import { RegisterComponent } from './components/user/register/register.component';
import { ApoderadoComponent } from './components/home/apoderado/apoderado.component';
import { SubjectsComponent } from './components/home/teacher/subject/subject.component';
import { TeacherComponent } from './components/home/teacher/teacher.component';
import { LevelComponent } from './components/home/teacher/level/level.component';
import { CourseComponent } from './components/home/teacher/course/course.component';
import { EditProfileComponent } from './components/user/edit-profile/edit-profile.component';
import { HomeComponent } from './components/home/home.component';
import { ThemeComponent } from './components/home/teacher/theme/theme.component';
import { TestComponent } from './components/home/teacher/test/test.component';
import { AddQuestionsComponent } from './components/home/teacher/test/add-questions/add-questions.component';
import { PlanningComponent } from './components/home/administrator/planning/planning.component';
import { AdministratorComponent } from './components/home/administrator/administrator.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { UnitComponent } from './components/home/administrator/unit/unit.component';
import { AxiComponent } from './components/home/administrator/axi/axi.component';
import { ObjectiveComponent } from './components/home/administrator/objective/objective.component';
import { AttitudeComponent } from './components/home/administrator/attitude/attitude.component';
import { SkillComponent } from './components/home/administrator/skill/skill.component';
import { AxiObjectiveComponent } from './components/home/administrator/planning/axi-objective/axi-objective.component';
import { UnitObjectiveComponent } from './components/home/administrator/planning/unit-objective/unit-objective.component';
import { SubobjectiveComponent } from './components/home/administrator/subobjective/subobjective.component';
import { SubobjectiveObjectiveComponent } from './components/home/administrator/planning/subobjective-objective/subobjective-objective.component';
import { UnitSkillComponent } from './components/home/administrator/planning/unit-skill/unit-skill.component';
import { UnitAttitudeComponent } from './components/home/administrator/planning/unit-attitude/unit-attitude.component';
import { ObjectiveIndicatorComponent } from './components/home/administrator/planning/objective-indicator/objective-indicator.component';
import { IndicatorComponent } from './components/home/administrator/indicator/indicator.component';

const routes: Routes = [
    {
        path: 'home', component: HomeComponent, children: [
            {
                path: 'administrador', component: AdministratorComponent, children: [
                    {
                        path: 'cobertura_curricular',
                        component: PlanningComponent
                    },
                    { path: '', redirectTo: 'administrador', pathMatch: "full" }
                ]
            },
            {
                path: 'profesor', component: TeacherComponent, children: [
                    {
                        path: 'niveles',
                        component: LevelComponent
                    },
                    {
                        path: 'cursos',
                        component: CourseComponent
                    },
                    {
                        path: 'asignaturas',
                        component: SubjectsComponent
                    },
                    {
                        path: 'materias',
                        component: ThemeComponent
                    },
                    {
                        path: 'pruebas',
                        component: TestComponent, children: [
                            {
                                path: 'crear_preguntas',
                                component: AddQuestionsComponent
                            },

                            { path: '', redirectTo: 'pruebas', pathMatch: "full" }
                        ]
                    },
                    { path: '', redirectTo: 'profesor', pathMatch: "full" }

                ]
            },
            { path: 'alumno', component: AlumnoComponent },
            { path: 'apoderado', component: ApoderadoComponent },
            { path: 'editar-perfil', component: EditProfileComponent },
        ], canActivate: [AuthGuard]
    },
    { path: 'acceso', component: LoginComponent },
    { path: 'registro', component: RegisterComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: LoginComponent }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }
export const ArrayOfComponents = [
    HomeComponent,
    TeacherComponent,
    LevelComponent,
    CourseComponent,
    SubjectsComponent,
    ThemeComponent,
    TestComponent,
    AddQuestionsComponent,
    PlanningComponent,
    AlumnoComponent,
    ApoderadoComponent,
    LoginComponent,
    RegisterComponent,
    EditProfileComponent,
    AdministratorComponent,
    PaginationComponent,
    UnitComponent,
    AxiComponent,
    ObjectiveComponent,
    AttitudeComponent,
    SkillComponent,
    AxiObjectiveComponent,
    UnitObjectiveComponent,
    SubobjectiveComponent,
    UnitSkillComponent,
    UnitAttitudeComponent,
    ObjectiveIndicatorComponent,
    SubobjectiveObjectiveComponent,
    IndicatorComponent
]
