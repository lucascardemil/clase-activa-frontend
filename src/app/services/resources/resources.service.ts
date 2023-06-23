import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ResourcesService {

    constructor() { }


    datalist(recordSaved: any, record: any, list: any){
        if (recordSaved !== record) {
            record = recordSaved;
            if (record) {
                const existingIndex = list.findIndex((element:any) => element.id === record.id);
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
    
}
