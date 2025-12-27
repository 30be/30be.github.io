import { compileShader } from './anim'
import { cam } from './controls'
import { defaultCamera, defaultRoot } from './defaults'
import { Id, appendNumber, appendSVec, appendShapeDiv, appendShapes, appendTextEditor, appendTransform, appendVec } from './html-utils'
import { saveEvent } from './main'
import { S, isS, isSVec, matr4, vec3, svec3, isVec } from './mth'

export interface Transformations {
    position: svec3
    rotation: svec3
    scale: S
}
function isTransform<T>(v: T) {
    return (
        (v as unknown as Transformations) &&
        isSVec((v as unknown as Transformations).position) &&
        isSVec((v as unknown as Transformations).rotation) &&
        typeof (v as unknown as Transformations).position == 'number'
    )
}
interface Common {
    id: string
    transform: Transformations
}
interface Trivial extends Common {
    color: svec3
}
interface Sphere extends Trivial {
    kind: 'Sphere'
    position: svec3
    radius: S
}

interface Box extends Trivial {
    kind: 'Box'
    //position: svec3
    radius: S
    //rotation: svec3
    sideLengths: svec3
}

interface Torus extends Trivial {
    kind: 'Torus'
    //position: svec3
    //rotation: svec3
    radius1: S
    radius2: S
}

interface InfCylinder extends Trivial {
    kind: 'InfCylinder'
    point: svec3
}

interface Cone extends Trivial {
    kind: 'Cone'
    point1: svec3
    point2: svec3
    radius1: S
    radius2: S
}

interface Plane extends Trivial {
    kind: 'Plane'
    height: S
    normal: svec3 // normal
}
interface Triangle extends Trivial {
    kind: 'Triangle'
    point1: svec3
    point2: svec3
    point3: svec3
}
interface Custom extends Common {
    kind: 'Custom'
    content: string
}

export interface Two extends Common {
    kind: 'Union' | 'Subtraction' | 'Xor' | 'Intersection'
    shapes: Map<string, Shape>
    smoothness: S
}
// To be continued ...
export interface DeleteEvent {
    kind: 'delete'
    parent: Two
    child: Shape
}
export interface AddEvent {
    kind: 'add'
    parent: Two
    child: Shape
}
export interface ChangeEvent {
    kind: 'add'
    parent: Two // will be removed
    child: Shape // will be renamed to shape
}
const defaultTransform = (): Transformations => ({ position: new svec3(), rotation: new svec3(), scale: new S(1) })

export type Shape = Sphere | Box | Torus | InfCylinder | Cone | Plane | Triangle | Two | Custom

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replacer(key: string, value: any) {
    if (value instanceof Map)
        return {
            dataType: 'Map',
            value: Array.from(value.entries())
        }
    if (isSVec(value))
        return {
            dataType: 'SVec',
            value: { x: value.x, y: value.y, z: value.z }
        }
    if (isVec(value))
        return {
            dataType: 'Vec',
            value: { x: value.x, y: value.y, z: value.z }
        }

    if (isS(value))
        return {
            dataType: 'S',
            value: { s: value.s }
        }
    return value
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reviver(key: string, value: any) {
    if (typeof value === 'object' && value !== null && value.dataType === 'Map') return new Map(value.value)
    if (typeof value === 'object' && value !== null && value.dataType === 'SVec') return new svec3(value.value.x, value.value.y, value.value.z)
    if (typeof value === 'object' && value !== null && value.dataType === 'Vec') return new vec3(value.value.x, value.value.y, value.value.z)
    if (typeof value === 'object' && value !== null && value.dataType === 'S') return new S(value.value.s)
    Id.setMax(+(value.id as string))

    return value
}
function getRoot(): Two {
    const savedSceneString = window.localStorage.getItem('root')
    if (savedSceneString) {
        return JSON.parse(savedSceneString, reviver)
    }
    return JSON.parse(defaultRoot, reviver) //{ kind: 'Union', shapes: new Map(), smoothness: new S(0), transform: defaultTransform(), id: Id.new }
}
let root: Two = { kind: 'Union', shapes: new Map(), smoothness: new S(0), transform: defaultTransform(), id: 'shapes' }
let content: Shape = getRoot()

const savedSceneString = window.localStorage.getItem('camera')
if (savedSceneString) {
    const camInfo = JSON.parse(savedSceneString, reviver)
    cam.camSet(camInfo.loc, camInfo.at, camInfo.up, cam.pos, cam.userLoc)
} else {
    const camInfo = JSON.parse(defaultCamera, reviver)
    cam.camSet(camInfo.loc, camInfo.at, camInfo.up, cam.pos, cam.userLoc)
}

export const shapeTypes = [
    'Sphere',
    'Box',
    'Torus',
    'InfCylinder',
    'Cone',
    'Plane',
    'Triangle',
    'Union',
    'Subtraction',
    'Xor',
    'Intersection',
    'Custom'
] as const
export type ShapeType = (typeof shapeTypes)[number]

export function isTwo(shape: Shape) {
    return shape.kind == 'Union' || shape.kind == 'Xor' || shape.kind == 'Intersection' || shape.kind == 'Subtraction'
}
export function shapeAdd<T extends Shape>(shape: Shape, target: Two) {
    target.shapes.set(shape.id, shape)

    const parentDiv = document.getElementById(target.id) as HTMLDivElement
    const shapeDiv = appendShapeDiv(shape, parentDiv, (newKind?: ShapeType) => {
        saveEvent({ kind: 'delete', parent: target, child: shape })
        target.shapes.delete(shape.id)
        if (newKind) {
            addShape(newKind, target)
        }
        compileShader()
    })

    const tShape = shape as T

    //for (const [key, value] of Object.entries(shape)) {
    let key: keyof T

    for (key in tShape) {
        const capturedKey: keyof T = key // needed for lambdas
        switch (
            typeof tShape[key] // v should be any, but who knows?
        ) {
            case 'number':
                appendTextEditor(key, tShape[capturedKey] as unknown as string, shapeDiv, (newVal) => {
                    ;(tShape[capturedKey] as unknown as string) = newVal
                    compileShader()
                })
                break
            case 'string':
                if (key == 'content')
                    appendTextEditor(key, tShape[capturedKey] as unknown as string, shapeDiv, (newString) => {
                        ;(tShape[capturedKey] as unknown as string) = newString
                        compileShader()
                    })
                break
            case 'object':
                if (isSVec(tShape[key])) {
                    appendSVec(key.toString(), tShape[capturedKey] as unknown as svec3, shapeDiv)
                } else if (key == 'shapes') {
                    appendShapes(key, shape as Two, shapeDiv)
                } else if (isS(tShape[key])) {
                    appendTextEditor(key, tShape[capturedKey] as unknown as S, shapeDiv, (newVal) => {
                        ;(tShape[capturedKey] as unknown as S).s = newVal
                        compileShader()
                    })
                } else break
        }
    }
}
export function addShape(shapeType: ShapeType, target: Two) {
    let shape: Shape
    // Order of field declaration is very important
    switch (shapeType) {
        case 'Sphere':
            shape = { kind: shapeType, position: new svec3(), radius: new S(1), transform: defaultTransform(), color: new svec3(0.8, 0.8, 0.8), id: Id.new }
            break
        case 'Box':
            shape = {
                kind: shapeType,
                radius: new S(0),
                sideLengths: new svec3(1, 1, 1),
                transform: defaultTransform(),
                color: new svec3(1, 0, 0.0),
                id: Id.new
            }
            break
        case 'Torus':
            shape = { kind: shapeType, radius1: new S(1), radius2: new S(0.3), transform: defaultTransform(), color: new svec3(0.8, 0.8, 0.8), id: Id.new }
            break
        case 'InfCylinder':
            shape = { kind: shapeType, point: new svec3(1, 1, 1), transform: defaultTransform(), color: new svec3(0.8, 0.8, 0.8), id: Id.new }
            break
        case 'Cone':
            shape = {
                kind: shapeType,
                point1: new svec3(),
                point2: new svec3(),
                radius1: new S(1),
                radius2: new S(1),
                transform: defaultTransform(),
                color: new svec3(0.8, 0.8, 0.8),
                id: Id.new
            }
            break
        case 'Plane':
            shape = {
                kind: shapeType,
                normal: new svec3(0, 1, 0),
                height: new S(0),
                transform: defaultTransform(),
                color: new svec3(0.8, 0.8, 0.8),
                id: Id.new
            }
            break
        case 'Triangle':
            shape = {
                kind: shapeType,
                point1: new svec3('1', '0', '0'),
                point2: new svec3('1', '0', '0'),
                point3: new svec3('1', '0', '0'),
                transform: defaultTransform(),
                color: new svec3(0.8, 0.8, 0.8),
                id: Id.new
            }
            break
        case 'Union':
        case 'Xor':
        case 'Intersection':
        case 'Subtraction':
            shape = { kind: shapeType, shapes: new Map(), smoothness: new S(0), transform: defaultTransform(), id: Id.new }
            break
        case 'Custom':
            shape = { kind: shapeType, content: '', transform: defaultTransform(), id: Id.new }
            break
    }
    shapeAdd(shape, target)
    saveEvent({ kind: 'add', child: shape, parent: target })
}
function recursiveShapeAdd(shape: Shape, target: Two) {
    shapeAdd(shape, target)
    if (isTwo(shape)) for (const shp of (shape as Two).shapes) recursiveShapeAdd(shp[1], shape as Two)
}
export function shapeDelete(c: Shape, p: Two) {
    document.getElementById(c.id)?.parentElement?.remove()
    p.shapes.delete(c.id)
}
function generateWorldMapRec<T extends Shape>(shape: T | null = content as T, parentTransform: Transformations): string | null {
    if (!shape) return null
    console.log('generated', shape)
    if (shape.kind == 'Custom') {
        if (shape.content === '') return null
        else return shape.content
    }
    let result: string
    const transform = shape.transform // multiply by parent`s one later
    if (!isTwo(shape))
        result =
            /*`
vec3(
    inverse(
        MatrRotateXYZ(
            D2R(${transform.rotation.x}),
            D2R(${transform.rotation.y}),
            D2R(${transform.rotation.z})) * 
        MatrTranslate(${transform.position.str()})
        )
    )*/
            `Col(${shape.kind}(vec3(inverse(MatrRotateTranslate(
                D2R(${transform.rotation.x}),D2R(${transform.rotation.y}),D2R(${transform.rotation.z}),
                ${transform.position.x},${transform.position.y},${transform.position.z}
            )) * vec4(p,0))/${transform.scale.s},
            `
    else result = `${shape.kind}(`
    let key: keyof T

    for (key in shape) {
        let added = true
        switch (
            typeof shape[key] // v should be any, but who knows?
        ) {
            case 'number':
                if (shape.kind != 'Xor')
                    //kostyl
                    result += (shape[key] as number).toFixed(1)
                break
            case 'object':
                if (isSVec(shape[key]) && key != 'color') {
                    result += (shape[key] as unknown as svec3).str()
                } else if (key == 'shapes') {
                    const shp = shape as unknown as Two
                    if (shp.shapes.size == 2) {
                        const localResults: (string | null)[] = []
                        for (const iShape of shp.shapes) {
                            localResults.push(generateWorldMapRec(iShape[1], transform))
                        }
                        if (localResults[0] === null) return localResults[1]
                        else if (localResults[1] === null) return localResults[0]
                        else result += localResults // they are automatically merged with ','
                    } else if (shp.shapes.size == 1) {
                        for (const iShape of shp.shapes) return generateWorldMapRec(iShape[1], transform)
                        result = result.substring(0, result.length - 1) // remove trailing comma
                    } else if (shp.shapes.size > 2) {
                        // I substitute existing shape with one of kind: {kind:same, shapes: [shapes[0], shapes[1..]] ...}
                        for (const [Key, Val] of shp.shapes) {
                            const copiedMap = new Map(shp.shapes)
                            const shapesMap = new Map()
                            shapesMap.set(Key, Val)
                            copiedMap.delete(Key)
                            let id
                            shapesMap.set((id = Id.new), {
                                kind: shp.kind,
                                transform: shp.transform,
                                shapes: copiedMap,
                                smoothness: shp.smoothness,
                                id: id
                            })
                            return generateWorldMapRec(
                                {
                                    kind: shp.kind,
                                    transform: shp.transform,
                                    shapes: shapesMap,
                                    smoothness: shp.smoothness,
                                    id: Id.new
                                },
                                transform
                            )
                        }
                    } else return null
                } else if (isS(shape[key])) {
                    result += (shape[key] as unknown as S).s
                } else added = false
                break
            default:
                added = false
        }
        if (added) result += ','
    }

    result = result.substring(0, result.length - 1) // remove trailing comma
    result += ')'

    if (!isTwo(shape)) result += '*' + transform.scale
    if (!isTwo(shape) && (shape as Trivial).color) result += `,${(shape as Trivial).color.str()})`
    return result
}
export function generateWorldMap<T extends Shape>(shape: T | null = content as T): string {
    const worldMap = generateWorldMapRec(shape, defaultTransform())
    if (!worldMap) return 'Col(0.0, vec3(0.0))'
    const worldDiv = document.getElementById('world')
    if (worldDiv) worldDiv.innerText = worldMap
    return worldMap
}
export function initShapes() {
    recursiveShapeAdd(content, root)
}

export function saveScene() {
    //alert(JSON.stringify(root, replacer))
    window.localStorage.setItem('root', JSON.stringify(content, replacer)) // first element in root
    window.localStorage.setItem('camera', JSON.stringify(cam, replacer))
}

export function exportScene() {
    //alert(JSON.stringify(root, replacer))
    console.log('root', JSON.stringify(content, replacer)) // first element in root
    console.log('camera', JSON.stringify(cam, replacer))
}

export function reload() {
    root = { kind: 'Union', shapes: new Map(), smoothness: new S(0), transform: defaultTransform(), id: 'shapes' }
    content = JSON.parse(defaultRoot, reviver)
    ;(document.getElementById('shapes') as HTMLDivElement).innerText = ''
    recursiveShapeAdd(content, root)
    const camInfo = JSON.parse(defaultCamera, reviver)
    cam.camSet(camInfo.loc, camInfo.at, camInfo.up, cam.pos, cam.userLoc)
    compileShader()
}
