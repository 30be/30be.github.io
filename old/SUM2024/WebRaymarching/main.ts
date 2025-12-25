import * as controls from './controls.js'
import { compileShader, init, render } from './anim.js'
import { AddEvent, DeleteEvent, ChangeEvent, shapeAdd, shapeDelete, initShapes, saveScene, exportScene, reload } from './shapes.js'

export let isMouseOverCanvas: boolean = false
type HistoryEvent = DeleteEvent | AddEvent | ChangeEvent | null
const eventHistory = Array<HistoryEvent>()
const undoHistory = Array<HistoryEvent>()

export function saveEvent(event: HistoryEvent) {
    eventHistory.push(event)
    undoHistory.length = 0
    updateHistory()
}
function updateHistory() {
    const historyDiv = document.getElementById('history')
    if (!historyDiv) {
        alert('Missing id=history container')
        return
    }
    historyDiv.innerHTML = ''
    const allEvents = eventHistory.concat([null], undoHistory)
    let eType = 'history'
    for (const event of allEvents) {
        const eventDiv = document.createElement('div')
        if (event == null) {
            eventDiv.className = 'history-current'
            eventDiv.innerText = '*'
            eType = 'undo'
        } else {
            eventDiv.className = eType + '-event'
            eventDiv.innerText = event.kind + ' ' + event.child.kind + event.child.id + ' of ' + event.parent.kind + event.parent.id
        }
        historyDiv.append(eventDiv)
    }
}

function Undo() {
    const lastEvent = eventHistory.pop()
    if (!lastEvent) {
        alert('History empty!')
        return
    }
    switch (lastEvent.kind) {
        case 'delete':
            shapeAdd(lastEvent.child, lastEvent.parent)
            compileShader()
            break
        case 'add':
            shapeDelete(lastEvent.child, lastEvent.parent)
            compileShader()
            break
    }
    undoHistory.push(lastEvent)
    updateHistory()
}

function Redo() {
    const lastEvent = undoHistory.pop()
    if (!lastEvent) {
        alert('Undo history empty!')
        return
    }
    switch (lastEvent.kind) {
        case 'delete':
            shapeDelete(lastEvent.child, lastEvent.parent)
            compileShader()
            break
        case 'add':
            shapeAdd(lastEvent.child, lastEvent.parent)
            compileShader()
            break
    }
    eventHistory.push(lastEvent)
    updateHistory()
}
export async function main() {
    const canvas = document.querySelector('#glcanvas') as HTMLCanvasElement
    canvas.addEventListener('mouseleave', () => {
        isMouseOverCanvas = false
    })
    canvas.addEventListener('mouseover', () => {
        isMouseOverCanvas = true
    })

    const reloadButton = document.getElementById('reload') as HTMLButtonElement
    if (reloadButton) reloadButton.onclick = reload

    resize()
    await init()
    initShapes()

    render()
}

function resize() {
    const canvas = document.querySelector('#glcanvas') as HTMLCanvasElement
    if (window.innerWidth < window.innerHeight) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight / 2
    } else {
        canvas.width = window.innerWidth / 2
        canvas.height = window.innerHeight
    }
}

window.addEventListener('load', main)
window.addEventListener('resize', resize)

window.onbeforeunload = saveScene
window.onmousemove = controls.handleMouseMove
window.onmousedown = controls.handleMouseDown
window.onmouseup = controls.handleMouseUp
window.onscroll = () => {
    if (isMouseOverCanvas) window.scroll(0, 0)
}
window.addEventListener('contextmenu', (e) => e.preventDefault())
window.addEventListener('wheel', controls.handleMouseZoom)
window.addEventListener('keyup', controls.handleKeyUp)
window.addEventListener('keydown', controls.handleKeyDown)

function KeyPress(e: KeyboardEvent) {
    if (e.keyCode == 90 && e.ctrlKey && e.shiftKey) Redo()
    else if (e.keyCode == 90 && e.ctrlKey) Undo()
    else if (e.key == 'r' && e.ctrlKey) controls.cam.setDef()
    else if (e.key == 'e') exportScene()
}

document.onkeydown = KeyPress

const tips = document.getElementById('checkout')?.childNodes
if (tips != undefined) {
    for (const tip of tips) {
        if (tip as HTMLDivElement)
            (tip as HTMLDivElement).onclick = () => {
                navigator.clipboard.writeText((tip as HTMLDivElement).innerText)
            }
    }
}
