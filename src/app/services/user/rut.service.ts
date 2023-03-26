import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RutService {

    msj: any;
    
    constructor() { }

    validaRUT(rut: any) {

        let valor = rut;
        valor = this.rutClean(valor);
        const cuerpo = valor.slice(0, -1);
        let dv = valor.slice(-1).toUpperCase();
        if (cuerpo.length < 7 && cuerpo.length > 1) {
            this.msj = true;
        }
        let suma = 0;
        let multiplo = 2;
        for (let i = 1; i <= cuerpo.length; i++) {
            const index = multiplo * Number(valor.charAt(cuerpo.length - i));
            suma = suma + index;
            if (multiplo < 7) {
                multiplo = multiplo + 1;
            }
            else {
                multiplo = 2;
            }
        }
        const dvEsperado = 11 - (suma % 11);
        dv = dv === 'K' ? '10' : dv;
        dv = dv === '0' ? '11' : dv;
        if (dvEsperado.toString() !== dv && cuerpo.length > 1) {
            this.msj = false;
        } else {
            this.msj = true;
        }
    }

    rutFormat(event: any) {
        const target = event.target;
        const rut = this.rutClean(target.value);
        if (rut.length <= 1) {
            return;
        }
        let result = `${rut.slice(-4, -1)}-${rut.substr(rut.length - 1)}`;
        for (let i = 4; i < rut.length; i += 3) {
            result = `${rut.slice(-3 - i, -i)}.${result}`;
        }
        target.value = result;
        this.validaRUT(rut);
    }

    rutClean(value: string) {
        return typeof value === 'string' ? value.replace(/[^0-9kK]+/g, '').toUpperCase() : '';
    }
}
