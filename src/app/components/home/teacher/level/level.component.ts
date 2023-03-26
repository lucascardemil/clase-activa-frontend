import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Level } from 'src/app/models/Level';
import { LevelService } from 'src/app/services/teacher/level.service';

import { NOTYF } from 'src/app/services/notyf/notyf.token'
import { Notyf } from 'notyf';

@Component({
    selector: 'app-level',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {

    levels: Level[] = [];

    levelAddForm = new FormGroup({
        name: new FormControl(),
        condition: new FormControl(),
    });

    levelUpdateForm = new FormGroup({
        id: new FormControl(),
        name_update: new FormControl(),
        condition_update: new FormControl(),
    });

    constructor(
        private levelService: LevelService,
        private formBuilder: FormBuilder,
        @Inject(NOTYF) private notyf: Notyf
    ) { }

    ngOnInit(): void {

        this.levelAddForm = this.formBuilder.group(
            {
                name: ['', [Validators.required]],
                condition: ['', [Validators.required]],
            })

        this.levelUpdateForm = this.formBuilder.group(
            {
                id: [''],
                name_update: ['', [Validators.required]],
                condition_update: ['', [Validators.required]],
            })

        this.levelService.getLevel().subscribe((data: any) => { this.levels = data })


    }

    addLevel(level: Level) {
        if (!this.levelAddForm.invalid) {
            this.levelService.addLevel(level).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.levelAddForm.reset();
                        this.notyf.success(res.message);
                        this.levels.push(res.level);
                    } else {
                        this.notyf.error(res.message);
                    }
                });
        }
    }

    updateLevel(level: Level) {
        if (!this.levelUpdateForm.invalid) {
            this.levelService.updateLevel(level).subscribe(
                (res: any) => {
                    if (res.status === 'success') {
                        this.notyf.success(res.message);
                        this.levelService.getLevel().subscribe((data: any) => { this.levels = data })
                    } else {
                        this.notyf.error(res.message);
                    }
                });
        }
    }

    editLevel(id: number) {

        this.levelUpdateForm.get('id')?.setValue(id);

        this.levelService.getIdLevel(id).subscribe((data: any) => {
            this.levelUpdateForm.patchValue({
                name_update: data[0].name,
                condition_update: '' + data[0].condition_level + '' 
            });
        })
    }

    deleteLevel(id: number) {
        this.levelService.deleteLevel(id).subscribe(
            (res: any) => {
                if (res.status === 'success') {
                    this.notyf.success(res.message);
                    this.levelService.getLevel().subscribe((data: any) => { this.levels = data })
                } else {
                    this.notyf.error(res.message);
                }
            });
    }

    get name() {
        return this.levelAddForm.get('name');
    }

    get name_update() {
        return this.levelUpdateForm.get('name_update');
    }

}
