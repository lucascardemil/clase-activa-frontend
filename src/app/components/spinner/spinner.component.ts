import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
    selector: 'app-spinner',
    template: `
    <div class="spinner" *ngIf="isLoading$ | async">
        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>`,
    styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent{
    isLoading$ = this.spinnerService.isLoading$

    constructor(private spinnerService: SpinnerService) { }
}
