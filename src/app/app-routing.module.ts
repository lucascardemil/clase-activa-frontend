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
import { PlanningComponent } from './components/home/teacher/planning/planning.component';


const routes: Routes = [
    {
        path: 'home', component: HomeComponent, children: [
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
                    {
                        path: 'cobertura_curricular',
                        component: PlanningComponent
                    },
                    { path: '', redirectTo: 'profesor', pathMatch: "full" }

                ]
            },
            { path: 'alumno', component: AlumnoComponent },
            { path: 'apoderado', component: ApoderadoComponent },
            { path: 'editar-perfil', component: EditProfileComponent },
        ], canActivate: [AuthGuard]
    },
    { path: 'acceso', component: LoginComponent},
    { path: 'registro', component: RegisterComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: LoginComponent}
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
    EditProfileComponent
]
