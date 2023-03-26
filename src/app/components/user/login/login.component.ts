import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { RutService } from 'src/app/services/user/rut.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token'
import { Notyf } from 'notyf';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    userForm = new FormGroup({
        role: new FormControl(),
        rut: new FormControl(),
        password: new FormControl()
    });

    constructor(
        private userService: UserService,
        public rutService: RutService,
        private router: Router,
        private formBuilder: FormBuilder,
        @Inject(NOTYF) private notyf: Notyf
    ) { }

    ngOnInit(): void {
        this.userForm = this.formBuilder.group({
            role: ['', [Validators.required]],
            rut: ['', [Validators.required]],
            password: ['', [Validators.required]],
        })
    }

    logIn(user: User) {
        if (!this.userForm.invalid) {
            this.userService.singIn(user).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        localStorage.setItem('token', res.token);
                        this.router.navigate(['/home']);
                    } else {
                        this.notyf.error(res.message);
                    }
                });
        }
    }

    get role() {
        return this.userForm.get('role');
    }

    get rut() {
        return this.userForm.get('rut');
    }

    get password() {
        return this.userForm.get('password');
    }
}



