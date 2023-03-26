import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Clase Activa';
    role: any = '';

    constructor(
        public userService: UserService,
    ) { }

    ngOnInit(): void {
    }

}
