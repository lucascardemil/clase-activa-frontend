import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user/user.service';
import { RutService } from 'src/app/services/user/rut.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token'
import { Notyf } from 'notyf';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    
    msjPassword: any;

    userForm = new FormGroup({
        role: new FormControl(),
        rut: new FormControl(),
        name: new FormControl(),
        email: new FormControl(),
        password: new FormControl(),
        repeatpassword: new FormControl(),
    });

    constructor(
        private userService: UserService,
        public rutService: RutService,
        private router: Router,
        private formBuilder: FormBuilder,
        @Inject(NOTYF) private notyf: Notyf,
    ) { }

    ngOnInit(): void {
        this.userForm = this.formBuilder.group(
            {
                role: ['', [Validators.required]],
                rut: ['', [Validators.required]],
                name: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required]],
                repeatpassword: ['', [Validators.required]]
            })
    }

    signUp(user: User) {
        if (!this.userForm.invalid) {
            this.userService.singUp(user).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.notyf.success(res.message);
                        setInterval( () => { 
                            this.router.navigate(['/login']);
                        }, 2000);
                        
                    } else {
                        this.notyf.error(res.message);
                    }
                });
        }
    }

    confirmPassword(event: any) {
        const repeatpassword = event.target.value;
        const password = this.password?.value;

        if (repeatpassword !== password) {
            this.msjPassword = false;
        } else {
            this.msjPassword = true;
        }

    }


    get role() {
        return this.userForm.get('role');
    }

    get rut() {
        return this.userForm.get('rut');
    }

    get name() {
        return this.userForm.get('name');
    }

    get email() {
        return this.userForm.get('email');
    }

    get password() {
        return this.userForm.get('password');
    }

    get repeatpassword() {
        return this.userForm.get('repeatpassword');
    }

}
