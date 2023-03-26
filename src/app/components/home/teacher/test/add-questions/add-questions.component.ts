import { Component, ElementRef, Inject, Input, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme } from 'src/app/models/Theme';
import { ThemeService } from 'src/app/services/teacher/theme.service';
import { AddQuestionService } from 'src/app/services/teacher/add-question.service';
import * as ClassicEditor from 'src/assets/js/ckeditor2';

import { NOTYF } from 'src/app/services/notyf/notyf.token'
import { Notyf } from 'notyf';



@Component({
    selector: 'app-add-questions',
    templateUrl: './add-questions.component.html',
    styleUrls: ['./add-questions.component.css']
})
export class AddQuestionsComponent {

    public classicEditor = ClassicEditor

    id_test: number = this.activatedRoute.snapshot.paramMap.get('id') as unknown as number
    list_themes: any = []
    image_preview: any = []
    image_preview_answer: any = []
    selected_alternative: any = []

    @Input() test: any;

    @ViewChildren('asCheckButtons') asCheckButtons!: QueryList<ElementRef>;
    @ViewChildren('asEditors') asEditors!: QueryList<ElementRef>;
    @ViewChildren('asFiles') asFiles!: QueryList<ElementRef>;

    @ViewChild('asShowAlternative') asShowAlternative!: ElementRef;
    @ViewChild('asShowTrueFalse') asShowTrueFalse!: ElementRef;
    @ViewChild('asTitle_question') asTitle_question!: ElementRef;
    @ViewChild('asImage_question') asImage_question!: ElementRef;
    @ViewChild('asText_aditional') asText_aditional!: ElementRef;
    @ViewChild('asAlternatives') asAlternatives!: ElementRef;


    public options: Object = {
        toolbar: [
            'heading', '|',
            'bold', 'italic', '|',
            'undo', 'redo', '|',
            'alignment', '|',
            'Mathtype',
        ],
        htmlAllowedTags: ['.*'],
        htmlAllowedAttrs: ['.*'],

    };

    questionAddForm = new FormGroup({
        theme: new FormControl(),
        question: new FormControl(),
        alternatives: new FormArray([]),
        true_false: new FormArray([]),
        image_question: new FormControl(),
        text_aditional: new FormControl(),
        type_question: new FormControl(),
        standard: new FormControl()
    });


    constructor(
        private activatedRoute: ActivatedRoute,
        private themeService: ThemeService,
        private formBuilder: FormBuilder,
        private addQuestionService: AddQuestionService,
        private renderer: Renderer2,
        @Inject(NOTYF) private notyf: Notyf
    ) { }


    ngOnInit(): void {

        this.questionAddForm = this.formBuilder.group(
            {
                theme: ['', [Validators.required]],
                question: ['', [Validators.required]],
                image_question: [''],
                text_aditional: [''],
                type_question: ['', [Validators.required]],
                alternatives: this.formBuilder.array([
                    this.formBuilder.group({
                        id: 'A',
                        editor: '',
                        image_alternative: '',
                        file: '',
                        selected: false
                    }),
                    this.formBuilder.group({
                        id: 'B',
                        editor: '',
                        image_alternative: '',
                        file: '',
                        selected: false
                    }),
                    this.formBuilder.group({
                        id: 'C',
                        editor: '',
                        image_alternative: '',
                        file: '',
                        selected: false
                    }),
                    this.formBuilder.group({
                        id: 'D',
                        editor: '',
                        image_alternative: '',
                        file: '',
                        selected: false
                    }),
                    this.formBuilder.group({
                        id: 'E',
                        editor: '',
                        image_alternative: '',
                        file: '',
                        selected: false
                    })
                ]),
                true_false: this.formBuilder.array([
                    this.formBuilder.group({
                        id: 'V',
                        label: 'Verdadero',
                        selected: false
                    }),
                    this.formBuilder.group({
                        id: 'F',
                        label: 'Falso',
                        selected: false
                    }),
                ]),

                // standard: ['', [Validators.required]],
                test: this.id_test
            })

        this.selectThemes(this.test[0].subject)

    }


    formValidation(form: any) {
        let result: boolean = false
        let count = 0

        if (form.type_question === '1') {

            const alternative_selected = form.alternatives.filter((alternative: any) => alternative.selected === true)

            if (alternative_selected.length > 0) {
                if (alternative_selected[0].editor !== '') {
                    form.alternatives.map((editor: any, index: any) => {
                        if (editor.id !== 'E') {
                            if (editor.editor !== '' || editor.image_alternative !== '') {
                                if (++count >= 2) {
                                    result = true
                                }
                            } else {
                                this.notyf.error('¡La alternativa <b>' + editor.id + '</b>, escriba la respuesta o seleccione una imagen!');
                            }
                        }
                    })
                } else {
                    this.notyf.error('¡La alternativa correcta, no contiene respuesta o imagen!');
                }
            } else {
                this.notyf.error('¡Seleccione la alternativa correcta!');
            }
        } else {

            const alternative_selected = form.true_false.filter((alternative: any) => alternative.selected === true)

            if (alternative_selected.length > 0) {
                result = true
            } else {
                this.notyf.error('¡Seleccione la respuesta correcta!');
            }
        }

        return result
    }



    addQuestion(form: any) {

        const formData = new FormData();

        console.log(this.formValidation(form))
        console.log(form)



        // if (this.image_preview.length > 0) {
        //     formData.append("image_question", this.image_preview[0]);
        // }

        // if (form.type_question === '1') {

        //     formData.append("alternatives[]", JSON.stringify(form.alternatives))

        // } else {

        //     formData.append("true_false[]", JSON.stringify(form.true_false))

        // }



        // formData.append("test", form.test)
        // formData.append("theme", form.theme)
        // formData.append("title_question", form.question)
        // formData.append("text_aditional", form.text_aditional)
        // formData.append("type_question", form.type_question)


        // formData.forEach((element: any) => {
        //     console.log(element)
        // })




    }

    preview(preview: any) {

        console.log(preview)

        let title = this.asTitle_question.nativeElement
        let image = this.asImage_question.nativeElement
        let text_aditional = this.asText_aditional.nativeElement
        let alternatives = this.asAlternatives.nativeElement

        title.innerHTML = preview.question

        if (this.image_preview.length > 0) {
            image.innerHTML = `<img class="rounded w-25" src="` + URL.createObjectURL(this.image_preview[0]) + `" />`
        }

        text_aditional.innerHTML = preview.text_aditional

        if (preview.type_question === '1') {
            alternatives.innerHTML = ''

            preview.alternatives.map((answer: any, index: any) => {
                const alternative = ((index + 1) + 9).toString(36).toUpperCase()

                if (answer.file != '') {
                    if (answer.selected === true) {
                        alternatives.innerHTML += `
                        <div class="d-flex justify-content-start align-items-center mark p-0 mb-2">
                            <p class="me-1 mb-0">` + alternative + `)</p>
                            <img class="rounded w-25" src="` + answer.file + `" />
                        </div>`
                    } else {
                        alternatives.innerHTML += `
                        <div class="d-flex justify-content-start align-items-center mb-2">
                            <p class="me-1 mb-0">` + alternative + `)</p>
                            <img class="rounded w-25" src="` + answer.file + `" />
                        </div>`
                    }

                } else {
                    if (answer.editor != '') {
                        if (answer.selected === true) {
                            alternatives.innerHTML +=
                                `<div class="d-flex justify-content-start align-items-center mark p-0 mb-2">
                                <p class="me-1 mb-0">` + alternative + `)</p>`
                                + answer.editor +
                                `</div>`
                        } else {
                            alternatives.innerHTML +=
                                `<div class="d-flex justify-content-start align-items-center mb-2">
                                <p class="me-1 mb-0">` + alternative + `)</p>`
                                + answer.editor +
                                `</div>`
                        }
                    }
                }
            })
        } else {
            preview.true_false.map((answer: any, index: any) => {
                alternatives.innerHTML = ''
                const alternative = ((index + 1) + 9).toString(36).toUpperCase()
                if (answer.selected === true) {

                    alternatives.innerHTML += `<div class="d-flex justify-content-start align-items-center mark p-0 mb-2"">
                                                    <p class="me-1 mb-0">` + alternative + `)</p>
                                                    <p>`+ answer.label + `</p>
                                            </div>`
                } else {
                    alternatives.innerHTML += `<div class="d-flex justify-content-start align-items-center mb-2">
                                                    <p class="me-1 mb-0">` + alternative + `)</p>
                                                    <p>`+ answer.label + `</p>
                                            </div>`
                }
            })
        }
    }


    imagePreview(event: any) {
        this.image_preview = []
        if (event.target.files) {
            this.image_preview.push(event.target.files[0]);
        }
    }

    imagePreviewAnswer(event: any, i: number) {

        if (event.target.files) {

            var reader = new FileReader();
            reader.onload = (e: any) => {

                const alternatives = this.alternatives.value
                alternatives.map((answer: any, index: any) => {
                    if (i === index) {
                        answer.file = e.target.result
                        answer.editor = ''
                    }
                })
            }
            reader.readAsDataURL(event.target.files[0])
        }

        this.addQuestionService.hideEditors(i, this.asEditors)

            const alternative_selected = this.addQuestionService.alternativeSelected(this.selected_alternative[0], this.alternatives)
            if (alternative_selected !== undefined) {
                alternative_selected.selected = true
            }
    }

    showAnswers(event: any) {
        let option = event.target.value
        const asShowAlternative = this.asShowAlternative.nativeElement;
        const asShowTrueFalse = this.asShowTrueFalse.nativeElement;

        if (option === '1') {
            this.renderer.removeAttribute(asShowAlternative, 'hidden', '')
            this.renderer.setAttribute(asShowTrueFalse, 'hidden', '')
        } else {
            this.renderer.setAttribute(asShowAlternative, 'hidden', '')
            this.renderer.removeAttribute(asShowTrueFalse, 'hidden', '')
        }
    }



    selectThemes(id: number) {
        this.list_themes = []
        this.themeService.getThemeForSubject(id).subscribe((themes: any) => {
            themes.map((theme: Theme) => {
                this.list_themes.push({
                    id: theme.id,
                    name: theme.name
                })
            })
        })
    }

    clearImageQuestion() {
        this.image_question?.patchValue('')
        this.image_preview = []
    }

    clearImageAnswer(i: number) {

        this.addQuestionService.clearFiles(i, this.alternatives, this.asFiles)
        this.addQuestionService.showEditors(i, this.asEditors)
    }

    EditorKeyUp(event: any, i: number) {

        const alternative_selected = this.addQuestionService.alternativeSelected(this.selected_alternative[0], this.alternatives)
        if (alternative_selected !== undefined) {

            if (event.target.children[0].innerText.length > 1) {
                this.addQuestionService.hideFiles(i, this.asFiles)
                alternative_selected.selected = true
            } else {
                this.addQuestionService.showFiles(i, this.asFiles)
                alternative_selected.selected = false
            }
        } else {
            if (event.target.children[0].innerText.length > 1) {
                this.addQuestionService.hideFiles(i, this.asFiles)
            } else {
                this.addQuestionService.showFiles(i, this.asFiles)
            }

        }

        this.addQuestionService.clearFiles(i, this.alternatives, this.asFiles)
    }

    selectedTrueFalse(i: number) {
        const true_false_selected = this.true_false.at(i)
        const true_false = this.true_false.value

        true_false.filter((true_false: any) => {
            if (true_false.id != true_false_selected.value.id) {
                true_false.selected = false
            } else {
                true_false.selected = true
            }
        });
    }

    selectedAlternative(i: number) {
        const alternative_selected = this.addQuestionService.alternativeSelected(i, this.alternatives)
        const alternatives = this.alternatives.value

        alternatives.filter((alternative: any) => {
            if (alternative.id != alternative_selected.id) {
                alternative.selected = false
            } else {
                alternative.selected = true
                this.selected_alternative.push(i)
            }
        });
    }

    get theme() {
        return this.questionAddForm.get('theme');
    }

    get question() {
        return this.questionAddForm.get('question');
    }

    get text_aditional() {
        return this.questionAddForm.get('text_aditional');
    }

    get image_question() {
        return this.questionAddForm.get('image_question');
    }

    get type_question() {
        return this.questionAddForm.get('type_question');
    }

    get alternatives(): FormArray {
        return this.questionAddForm.get('alternatives') as FormArray;
    }

    get true_false(): FormArray {
        return this.questionAddForm.get('true_false') as FormArray;
    }

}

