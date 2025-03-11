import { compileShader } from './anim'
import { S, svec3, vec3 } from './mth'
import { Shape, ShapeType, Transformations, Two, addShape, isTwo, shapeTypes } from './shapes'

export class Id {
    private static currentId = 0
    static get new() {
        this.currentId++
        return (this.currentId - 1).toString()
    }
    static setMax<T>(newId: T) {
        if (typeof newId == 'number' && !isNaN(newId) && newId >= this.currentId) this.currentId = newId + 1
    }
}
export function appendTextEditor(name: string, initial: string | number | S, parent: HTMLDivElement, onchange: (newVal: string) => void) {
    const input1 = document.createElement('input')
    input1.type = 'text'
    input1.value = initial.toString()
    input1.placeholder = name
    input1.id = Id.new
    input1.onchange = () => {
        onchange(input1.value)
    }

    const label = document.createElement('label')
    label.textContent = name
    label.htmlFor = input1.id

    parent.append(label)
    parent.append(input1)
}
export function appendNumber(name: string, initial: number, parent: HTMLDivElement, onchange: (newVal: number) => void) {
    const input1 = document.createElement('input')
    input1.type = 'number'
    input1.value = initial.toString()
    input1.placeholder = name
    input1.id = Id.new
    input1.onchange = () => {
        onchange(+input1.value)
    }

    const label = document.createElement('label')
    label.textContent = name
    label.htmlFor = input1.id

    parent.append(label)
    parent.append(input1)
}
export function appendSVec(name: string, vector: svec3, parent: HTMLDivElement) {
    const inputDiv: HTMLDivElement = document.createElement('div')

    const label = document.createElement('span')
    label.textContent = name
    inputDiv.append(label)

    appendTextEditor('X', vector.x, inputDiv, (newVal) => {
        vector.x = newVal
        compileShader()
    })
    appendTextEditor('Y', vector.y, inputDiv, (newVal) => {
        vector.y = newVal
        compileShader()
    })
    appendTextEditor('Z', vector.z, inputDiv, (newVal) => {
        vector.z = newVal
        compileShader()
    })

    parent.append(inputDiv)
}
export function appendVec(name: string, vector: vec3, parent: HTMLDivElement) {
    const inputDiv: HTMLDivElement = document.createElement('div')

    const label = document.createElement('span')
    label.textContent = name
    inputDiv.append(label)

    appendNumber('X', vector.x, inputDiv, (newVal) => {
        vector.x = newVal
        compileShader()
    })
    appendNumber('Y', vector.y, inputDiv, (newVal) => {
        vector.y = newVal
        compileShader()
    })
    appendNumber('Z', vector.z, inputDiv, (newVal) => {
        vector.z = newVal
        compileShader()
    })

    parent.append(inputDiv)
}
export function appendShapes(name: string, shape: Two, parent: HTMLDivElement) {
    const inputDiv: HTMLDivElement = document.createElement('div')

    const shapeAddButton = document.createElement('button')
    shapeAddButton.innerText = 'Add'
    shapeAddButton.className = 'button-add'
    shapeAddButton.onclick = () => {
        addShape(shapeTypes[shapeTypeSelect.selectedIndex], shape as Two)
        compileShader()
    }
    inputDiv.append(shapeAddButton)

    const shapeTypeSelect: HTMLSelectElement = document.createElement('select')
    shapeTypes.forEach((shapeType) => {
        const shapeSelectOption = document.createElement('option')
        shapeSelectOption.value = shapeType
        shapeSelectOption.innerHTML = shapeType
        shapeTypeSelect.append(shapeSelectOption)
    })
    inputDiv.append(shapeTypeSelect)

    parent.append(inputDiv)
}

export function appendShapeDiv(shape: Shape, parent: HTMLDivElement, onDelete: (newKind?: ShapeType) => void): HTMLDivElement {
    const shapeDiv: HTMLDivElement = document.createElement('div')

    shapeDiv.className = 'shape'
    shapeDiv.innerText = 'ID: ' + shape.id
    parent.append(shapeDiv)

    const shapeType = document.createElement('select')
    shapeType.style.margin = '5px'
    const is2 = isTwo(shape)
    shapeTypes.forEach((type) => {
        const shapeSelectOption = document.createElement('option')
        shapeSelectOption.value = type
        shapeSelectOption.innerHTML = type
        shapeType.append(shapeSelectOption)
    })
    shapeType.selectedIndex = shapeTypes.findIndex((el) => {
        return el == shape.kind
    })
    shapeType.onchange = () => {
        if (isTwo(shape)) {
            shape.kind = shapeTypes[shapeType.selectedIndex]
            compileShader()
        } else {
            shapeDiv.remove()
            onDelete(shapeTypes[shapeType.selectedIndex])
        }
    }
    shapeDiv.append(shapeType)

    if (shape.id != '0') {
        // Main content
        const deleteButton: HTMLButtonElement = document.createElement('button')
        deleteButton.className = 'button-delete'
        deleteButton.innerText = 'Delete'
        deleteButton.onclick = () => {
            shapeDiv.remove()
            onDelete()
        }
        shapeDiv.append(deleteButton)
    }
    const content: HTMLDivElement = document.createElement('div')
    const hideButton: HTMLButtonElement = document.createElement('button')
    hideButton.className = 'button-hide'
    hideButton.onclick = () => {
        if (content.style.display === 'none') {
            content.style.display = 'block'
            hideButton.innerHTML = 'hide'
        } else {
            content.style.display = 'none'
            hideButton.innerHTML = 'show'
        }
    }

    content.style.margin = '0'
    if (isTwo(shape)) {
        hideButton.innerHTML = 'hide'
    } else {
        content.style.display = 'none'
        hideButton.innerHTML = 'show'
    }

    shapeDiv.append(hideButton)

    appendTransform(shape.transform, shapeDiv)

    content.id = shape.id
    const separator = document.createElement('hr')
    content.append(separator)

    shapeDiv.append(content)

    return content
}

export function appendTransform(transform: Transformations, parent: HTMLDivElement) {
    const transformDiv = document.createElement('div')

    const hideButton: HTMLButtonElement = document.createElement('button')
    hideButton.innerHTML = 'show transforms'
    hideButton.className = 'button-hide'
    hideButton.onclick = () => {
        if (transformDiv.style.display === 'none') {
            transformDiv.style.display = 'block'
            hideButton.innerHTML = 'hide transforms'
        } else {
            transformDiv.style.display = 'none'
            hideButton.innerHTML = 'show transforms'
        }
    }
    parent.append(hideButton)

    appendSVec('position', transform.position, transformDiv)
    appendSVec('rotation', transform.rotation, transformDiv)
    appendTextEditor('scale', transform.scale, transformDiv, (newVal) => {
        transform.scale.s = newVal
        compileShader()
    })

    transformDiv.style.display = 'none'
    parent.append(transformDiv)
}
