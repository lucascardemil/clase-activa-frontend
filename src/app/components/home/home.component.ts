import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    @ViewChild('asSidebarMenu') asSidebarMenu!: ElementRef;

    constructor(public userService: UserService, private renderer: Renderer2, private router: Router) { }


    ngOnInit(): void {

    }

    hiddenMenuMobile() {
        const asSidebarMenu = this.asSidebarMenu.nativeElement;
        this.renderer.removeClass(asSidebarMenu, 'show')
    }

    logout() {
        this.userService.logout();
        this.router.navigate(['/acceso']);
    }
}
