import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule, ArrayOfComponents } from './app-routing.module';


//Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


//Providers
import { JwtHelperService, JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt'
import { TokenInterceptor } from './services/token.interceptor';
import { SpinnerInterceptor } from './services/spinner.interceptor';


//RUT
import { RutModule } from 'rut-chileno';
import { OrderByPipe } from './components/home/teacher/course/orderby.pipe';
import { SpinnerModule } from './components/spinner/spinner.module';

//MATH
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

//Notification
import { NOTYF, notyfFactory } from './services/notyf/notyf.token';


//AG-GRID
import { AgGridModule } from 'ag-grid-angular';
import { UnitComponent } from './components/home/administrator/unit/unit.component';
import { AxiComponent } from './components/home/administrator/axi/axi.component';
import { ObjectiveComponent } from './components/home/administrator/objective/objective.component';
import { AttitudeComponent } from './components/home/administrator/attitude/attitude.component';
import { SkillComponent } from './components/home/administrator/skill/skill.component';
import { AxiObjectiveComponent } from './components/home/administrator/planning/axi-objective/axi-objective.component';
import { UnitObjectiveComponent } from './components/home/administrator/planning/unit-objective/unit-objective.component';
import { SubobjectiveComponent } from './components/home/administrator/planning/subobjective/subobjective.component';
import { UnitSkillComponent } from './components/home/administrator/planning/unit-skill/unit-skill.component';
import { UnitAttitudeComponent } from './components/home/administrator/planning/unit-attitude/unit-attitude.component';
import { ObjectiveIndicatorComponent } from './components/home/administrator/planning/objective-indicator/objective-indicator.component';



@NgModule({
    declarations: [
        AppComponent,
        ArrayOfComponents,
        OrderByPipe,
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
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RutModule,
        SpinnerModule,
        CKEditorModule,
        AgGridModule
    ],
    providers: [
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService,
        //TokenInterceptor
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        //Spinner
        { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
        //Notyf
        { provide: NOTYF, useFactory: notyfFactory }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
