import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ResourcesService {
    checkboxs: any = []

    constructor() { }


    datalistArray(recordSaved: any, list: any) {
        if (recordSaved) {
            recordSaved.map((record:any) =>{
                const existingIndex = list.findIndex((element: any) => element.id === record.id);
                if (existingIndex >= 0) {
                    list.splice(existingIndex, 1);
                }
                list.push({
                    id: record.id,
                    name: record.course + '/' + record.subject + '/' + record.name
                });
            })
        }
        return list;
    }
    
    datalist(recordSaved: any, record: any, list: any) {
        if (recordSaved !== record) {
            record = recordSaved;
            if (record) {
                const existingIndex = list.findIndex((element: any) => element.id === record.id);
                if (existingIndex >= 0) {
                    list.splice(existingIndex, 1);
                }
                list.push(record);
            }
        }
        return list;
    }


    disabledButton(planning: any) {
        const result = planning.every((elemento: any) => {
            return Boolean(elemento);
        });

        return !result;
    }

    isArrayEmpty(array: any): boolean {
        return array.length === 0;
    }

    onScroll(event: any, stickyElements: any) {
        const maxScrollTop = event.target.scrollHeight - event.target.clientHeight;
        let scrollTop = event.target.scrollTop;
        stickyElements.forEach((stickyElement: any) => {
            stickyElement.nativeElement.style.top = `${Math.min(scrollTop, maxScrollTop)}px`;
        });
    }


    checkBox(event: any) {
        let id = event.target.id

        if (event.target.checked === true) {
            this.checkboxs.push({
                id: id
            })

        } else {
            this.checkboxs = this.checkboxs.filter((element: any) => element.id !== id)
        }

        return this.checkboxs;
    }

    list(name: any, list_table: any) {
        let list = list_table.filter((x: any) => x.name === name)[0];
        return list.id;
    }

}
