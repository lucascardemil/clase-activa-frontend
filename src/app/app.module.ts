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
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
    declarations: [
        AppComponent,
        ArrayOfComponents,
        OrderByPipe
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
        NgxPaginationModule
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
