import { ElementRef, Injectable, QueryList, Renderer2, RendererFactory2, ViewChild, ViewChildren } from '@angular/core';
import { FormArray } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class AddQuestionService {

    public renderer: Renderer2

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null)
    }

    alternativeSelected(id: number | undefined, alternatives: FormArray) {
        if(id !== undefined){
            const alternative_selected = alternatives.at(id)
            return alternative_selected.value
        }
    }

    hideEditors(id: number, editors: QueryList<ElementRef>) {
        const asEditors = editors.toArray();
        asEditors.forEach((asEditors) => {
            if (parseInt(asEditors.nativeElement.children[0].id) === id) {
                this.renderer.setAttribute(asEditors.nativeElement.children[0], 'hidden', '')
                this.renderer.setValue(asEditors.nativeElement.children[0], '')

                console.log(parseInt(asEditors.nativeElement.children[0].id) === id)

                console.log(asEditors.nativeElement.children[0])

                console.log(asEditors.nativeElement)
            }
        })
    }

    showEditors(id: number, editors: QueryList<ElementRef>) {
        const asEditors = editors.toArray();
        asEditors.forEach((asEditors) => {
            if (parseInt(asEditors.nativeElement.children[0].id) === id) {
                this.renderer.removeAttribute(asEditors.nativeElement.children[0], 'hidden', '')
            }
        })
    }
    showFiles(id: number, files: QueryList<ElementRef>) {
        const asFiles = files.toArray();
        asFiles.forEach((asFiles) => {
            if (parseInt(asFiles.nativeElement.children[0].id) === id) {
                this.renderer.removeAttribute(asFiles.nativeElement, 'hidden', '')
            }
        })
    }

    hideFiles(id: number, files: QueryList<ElementRef>) {
        const asFiles = files.toArray();
        asFiles.forEach((asFiles) => {
            if (parseInt(asFiles.nativeElement.children[0].id) === id) {
                this.renderer.setAttribute(asFiles.nativeElement, 'hidden', '')
            }
        })
    }

    clearFiles(id: number, alternatives: FormArray, files: QueryList<ElementRef>) {
        const asFiles = files.toArray();
        asFiles.forEach((asFiles) => {
            if (parseInt(asFiles.nativeElement.children[0].id) === id) {
                asFiles.nativeElement.children[0].value = ''
            }

            const alternative_selected = this.alternativeSelected(id, alternatives)
            alternative_selected.image_alternative = ''
            alternative_selected.file = ''

        })
    }

    checkButtonsTrue(id: number, checkButtons: QueryList<ElementRef>) {
        const asCheckButtons = checkButtons.toArray();
        asCheckButtons.forEach((asCheckButton) => {
            if (parseInt(asCheckButton.nativeElement.children[0].id) === id) {
                asCheckButton.nativeElement.children[0].checked = true
            }
        })
    }
    
    checkButtonsFalse(id: number, checkButtons: QueryList<ElementRef>) {
        const asCheckButtons = checkButtons.toArray();
        asCheckButtons.forEach((asCheckButton) => {
            if (parseInt(asCheckButton.nativeElement.children[0].id) === id) {
                asCheckButton.nativeElement.children[0].checked = false
            }
        })
    }
}
