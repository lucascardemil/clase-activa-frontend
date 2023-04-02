import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'src/app/models/Subject'
import { Course } from 'src/app/models/Course';
import { CourseService } from 'src/app/services/teacher/course.service';
import { SubjectService } from 'src/app/services/teacher/subject.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Level } from 'src/app/models/Level';
import { PlanningService } from 'src/app/services/teacher/planning.service';


import { NOTYF } from 'src/app/services/notyf/notyf.token';
import { Notyf } from 'notyf';
import { ColDef } from 'ag-grid-community';

@Component({
    selector: 'app-planning',
    templateUrl: './planning.component.html',
    styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {

    list_subjects: any = []
    list_niveles: any = []
    list_courses: any = []
    list_units: any = []
    list_axis: any = []
    list_objectives: any = []
    list_attitudes: any = []
    disabled: boolean = true

    checkboxs: any = []

    rowData: any = []

    public defaultColDef: ColDef = {
        sortable: true,
        resizable: true,
        filter: true,
    };

    colDefs: ColDef[] = [
        { field: 'curso', flex: 1 },
        { field: 'asignatura', flex: 1 },
        { field: 'unidad', flex: 1 },
        { field: 'eje', flex: 1 },
        {
            field: 'objetivo', flex: 1,
            cellRenderer: (params: any) => {
                // Obtiene los valores de las celdas que se van a combinar
                let valor1 = params.data.objetivo;
                let valor2 = params.data.subobjetivo;

                // Crea un contenedor para el div y la lista
                let container = document.createElement('div');
                // Crea un div para mostrar el primer valor
                let div = document.createElement('div');
                div.textContent = valor1;
                container.appendChild(div);
                // Crea una lista para mostrar el segundo valor
                let ul = document.createElement('ul');
                valor2.forEach((item: any) => {
                    let li = document.createElement('li');
                    li.textContent = item;
                    ul.appendChild(li);
                });
                container.appendChild(ul);
                return container;
            },
            autoHeight: true,


        },
        { field: 'indicador', flex: 1 },
        {
            field: 'accion', flex: 1,
            cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
            cellRenderer: (params: any) => {
                const button = document.createElement('button');
                button.innerText = 'Editar';
                button.classList.add('btn');
                button.classList.add('btn-warning');
                button.addEventListener('click', () => {
                    // Aquí puedes agregar la lógica para manejar el evento de clic en el botón
                    console.log('Botón clicado');
                });
                return button;
            },
        },
    ]

gridOptions = {
    pagination: true,
    paginationPageSize: 10,
    localeText: {
        // for set filter
        selectAll: 'Seleccionar Todo',
        searchOoo: 'Buscar...',
        blanks: 'En blanco',

        // for number filter and text filter
        filterOoo: 'Filtrar',
        applyFilter: 'Aplicar Filtro...',
        equals: 'Igual',
        notEqual: 'No Igual',

        // for number filter
        lessThan: 'Menos que',
        greaterThan: 'Mayor que',
        lessThanOrEqual: 'Menos o igual que',
        greaterThanOrEqual: 'Mayor o igual que',
        inRange: 'En rango de',

        // for text filter
        contains: 'Contiene',
        notContains: 'No contiene',
        startsWith: 'Empieza con',
        endsWith: 'Termina con',

        // filter conditions
        andCondition: 'Y',
        orCondition: 'O',

        // the header of the default group column
        group: 'Grupo',

        // tool panel
        columns: 'Columnas',
        filters: 'Filtros',
        valueColumns: 'Valos de las Columnas',
        pivotMode: 'Modo Pivote',
        groups: 'Grupos',
        values: 'Valores',
        pivots: 'Pivotes',
        toolPanelButton: 'BotonDelPanelDeHerramientas',

        // other
        noRowsToShow: 'No hay filas para mostrar',

        // enterprise menu
        pinColumn: 'Columna Pin',
        valueAggregation: 'Agregar valor',
        autosizeThiscolumn: 'Autoajustar esta columna',
        autosizeAllColumns: 'Ajustar todas las columnas',
        groupBy: 'agrupar',
        ungroupBy: 'desagrupar',
        resetColumns: 'Reiniciar Columnas',
        expandAll: 'Expandir todo',
        collapseAll: 'Colapsar todo',
        toolPanel: 'Panel de Herramientas',
        export: 'Exportar',
        csvExport: 'Exportar a CSV',
        excelExport: 'Exportar a Excel (.xlsx)',
        excelXmlExport: 'Exportar a Excel (.xml)',


        // enterprise menu pinning
        pinLeft: 'Pin Izquierdo',
        pinRight: 'Pin Derecho',


        // enterprise menu aggregation and status bar
        sum: 'Suman',
        min: 'Minimo',
        max: 'Maximo',
        none: 'nada',
        count: 'contar',
        average: 'promedio',

        // standard menu
        copy: 'Copiar',
        copyWithHeaders: 'Copiar con cabeceras',
        paste: 'Pegar'


    }
}


plannigAddForm = new FormGroup({
    level: new FormControl(),
    course: new FormControl(),
    subject: new FormControl(),
    axi: new FormControl(),
    skill: new FormControl(),
    attitude: new FormControl(),
    objective: new FormControl(),
    unit: new FormControl(),
    indicator: new FormControl(),
    subObjective: new FormControl()
});

gridApi: any;

constructor(
    private subjectService: SubjectService,
    private courseService: CourseService,
    private planningService: PlanningService,
        @Inject(NOTYF) private notyf: Notyf,
    private formBuilder: FormBuilder) { }

ngOnInit(): void {
    this.plannigAddForm = this.formBuilder.group(
        {
            level: ['', [Validators.required]],
            course: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            axi: ['', [Validators.required]],
            skill: ['', [Validators.required]],
            attitude: ['', [Validators.required]],
            objective: ['', [Validators.required]],
            unit: ['', [Validators.required]],
            indicator: ['', [Validators.required]],
            subObjective: ['', [Validators.required]]
        })

        this.loadLevels()
        this.loadUnits()
        this.loadAxis()
        this.loadObjectives()
        this.loadAttitudes()
        this.loadPlannings()
}

loadLevels() {
    this.list_niveles = []
    this.subjectService.getAllLevelsWithoutCourses().subscribe((niveles: any) => {
        niveles.map((nivel: Level) => {
            if (nivel.condition_level === 1) {
                this.list_niveles.push({
                    id: nivel.id,
                    name: nivel.name
                })
            }
        })
    })
}

loadCourses(event: any) {
    this.list_courses = []
    let id = event.target.value
    this.courseService.getCourseForLevel(id).subscribe((courses: any) => {
        courses.map((course: Course) => {
            this.list_courses.push({
                id: course.id,
                name: course.name
            })
        })
    })
}

loadSubjects(event: any) {
    this.list_subjects = []
    let id = event.target.value
    this.subjectService.getSubjectForCourse(id).subscribe((subjects: any) => {
        subjects.map((subject: Subject) => {
            this.list_subjects.push({
                id: subject.id,
                name: subject.name
            })
        })
    })
}

loadUnits() {
    this.list_units = []
    let table = 'planning_units'
    this.planningService.getIdPlanning(table).subscribe((units: any) => {
        units.map((unit: any) => {
            this.list_units.push({
                id: unit.id,
                name: unit.name
            })
        })
    })
}

loadAxis() {
    this.list_axis = []
    let table = 'axis'
    this.planningService.getIdPlanning(table).subscribe((axis: any) => {
        axis.map((axi: any) => {
            this.list_axis.push({
                id: axi.id,
                name: axi.name
            })
        })
    })
}

loadObjectives() {
    this.list_objectives = []
    let table = 'objectives'
    this.planningService.getIdPlanning(table).subscribe((objectives: any) => {
        objectives.map((objective: any) => {
            this.list_objectives.push({
                id: objective.id,
                name: objective.name
            })
        })
    })
}


loadAttitudes() {
    this.list_attitudes = []
    let table = 'attitudes'
    this.planningService.getIdPlanning(table).subscribe((attitudes: any) => {
        attitudes.map((attitude: any) => {
            this.list_attitudes.push({
                id: attitude.id,
                name: attitude.name
            })
        })
    })
}


loadPlannings() {
    this.planningService.getAllPlanning().subscribe((plannings: any) => {
        // Obtenemos un array de IDs de los registros
        let ids = plannings.map((planning: any) => planning.id);

        // Enviamos el array de IDs en una sola llamada a la función getIdsSubObjective
        this.planningService.getIdSubObjective(ids).subscribe((subobjectives: any) => {
            // Procesamos los subobjetivos devueltos por la función
            plannings.forEach((planning: any) => {
                // Buscamos los subobjetivos correspondientes a este registro
                let subobjectivesForThisPlanning = subobjectives.filter((subobjective: any) => subobjective.objective === planning.id);

                let subobjective = subobjectivesForThisPlanning.map((subobjective: any) => subobjective.name);

                this.rowData.push({
                    curso: planning.course,
                    asignatura: planning.subject,
                    unidad: planning.unit,
                    eje: planning.axi,
                    objetivo: planning.objective,
                    subobjetivo: subobjective,
                    indicador: planning.indicator
                })

            });
            this.gridApi.setRowData(this.rowData);
        });
    });
}

onGridReady(params: any) {
    this.gridApi = params.api;
}

savePlanning(planning: any) {
    this.planningService.addPlaning(planning).subscribe(
        (res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);

                if (res.result.table === 'axis') {
                    this.list_axis.push({ id: res.result.id, name: res.result.name })
                }

                if (res.result.table === 'objectives') {
                    this.list_objectives.push({ id: res.result.id, name: res.result.name })
                }

                if (res.result.table === 'attitudes') {
                    this.list_attitudes.push({ id: res.result.id, name: res.result.name })
                }
            } else {
                this.notyf.error(res.message);
            }
        });
}

savePlanningUnit(planning: any) {
    this.planningService.addPlanningUnit(planning).subscribe(
        (res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);
                this.list_units.push({ id: res.result.id, name: res.result.name })
            } else {
                this.notyf.error(res.message);
            }
        });
}

savePlanningAxi(planning: any) {

    this.checkboxs.map((element: any) => {
        element.unit = this.listUnits(planning.unit)
    })

    this.planningService.addPlanningAxi(this.checkboxs).subscribe(
        (res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.checkboxs = []

                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' ya está asociado!');
                });
            }
        });
}

savePlanningObjective(planning: any) {

    this.checkboxs.map((element: any) => {
        element.unit = this.listUnits(planning.unit)
    })

    this.planningService.addPlanningObjective(this.checkboxs).subscribe(
        (res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.checkboxs = []

                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' ya está asociado!');
                });
            }
        });
}

savePlanningSubObjective(planning: any) {

    this.checkboxs.map((element: any) => {
        element.subObjective = planning.subObjective
    })

    this.planningService.addPlanningSubObjective(this.checkboxs).subscribe(
        (res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.checkboxs = []

                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' ya está creado!');
                });
            }
        });
}

savePlanningSkill(planning: any) {

    planning = { name: planning.name, unit: this.listUnits(planning.unit) }

    this.planningService.addPlanningSkill(planning).subscribe(
        (res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.notyf.success(res.message);
                this.checkboxs = []
            } else {
                this.notyf.error(res.message);
            }
        });
}

savePlanningAttitude(planning: any) {

    this.checkboxs.map((element: any) => {
        element.unit = this.listUnits(planning.unit)
    })

    this.planningService.addPlanningAttitude(this.checkboxs).subscribe(
        (res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.checkboxs = []

                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' ya está asociado!');
                });
            }
        });
}

savePlanningIndicator(planning: any) {

    this.checkboxs.map((element: any) => {
        element.indicator = planning.indicator
    })

    this.planningService.addPlanningIndicator(this.checkboxs).subscribe(
        (res: any) => {
            if (res.status === 'success') {
                this.clearForm();
                this.checkboxs = []

                const { insertedRecords, existingRecords } = res.result;

                insertedRecords.forEach((record: any) => {
                    this.notyf.success('¡El ' + record.name + ' creado con exito!');
                });

                existingRecords.forEach((record: any) => {
                    this.notyf.error('¡El ' + record.name + ' ya está asociado!');
                });
            }
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

}


disabledButton(planning: any) {
    const result = planning.every((elemento: any) => {
        return Boolean(elemento);
    });

    return !result;
}

clearForm() {
    this.level?.setValue('');
    this.course?.setValue('');
    this.subject?.setValue('');
    this.unit?.setValue('');
    this.axi?.setValue('');
    this.skill?.setValue('');
    this.objective?.setValue('');
    this.subObjective?.setValue('');
    this.indicator?.setValue('');
    this.attitude?.setValue('');
    this.checkboxs = []
}

listUnits(name: any) {
    let list = this.list_units.filter((x: any) => x.name === name)[0];
    return list.id;
}

listAxis(name: any) {
    let list = this.list_axis.filter((x: any) => x.name === name)[0];
    return list.id;
}

listAttitudes(name: any) {
    let list = this.list_attitudes.filter((x: any) => x.name === name)[0];
    return list.id;
}


    get level() {
    return this.plannigAddForm.get('level');
}

    get course() {
    return this.plannigAddForm.get('course');
}

    get subject() {
    return this.plannigAddForm.get('subject');
}

    get axi() {
    return this.plannigAddForm.get('axi');
}

    get skill() {
    return this.plannigAddForm.get('skill');
}

    get attitude() {
    return this.plannigAddForm.get('attitude');
}

    get objective() {
    return this.plannigAddForm.get('objective');
}

    get unit() {
    return this.plannigAddForm.get('unit');
}

    get indicator() {
    return this.plannigAddForm.get('indicator');
}

    get subObjective() {
    return this.plannigAddForm.get('subObjective');
}

}
