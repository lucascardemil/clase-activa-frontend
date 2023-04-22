import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-modal-planning',
    templateUrl: './modal-planning.component.html',
    styleUrls: ['./modal-planning.component.css']
})
export class ModalPlanningComponent {

    private params: any;
    public id_objective: any

    agInit(params: any): void {
        this.params = params;
    }

    onClick() {
        this.id_objective = this.params.node.data.id_objetivo;

        if (this.params.onClick instanceof Function) {
            const params = this.params.node.data
            this.params.onClick(params);
        }
    }
}
