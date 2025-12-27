import { ControlCamera, cam } from './controls.js'
import { generateWorldMap } from './shapes.js'
export let gl: WebGL2RenderingContext

let programInfo: ProgramInfo
let buffers: Buffers

interface ProgramInfo {
    program: WebGLProgram
    attribLocations: {
        vertexPosition: number
    }
    uniformLocations: {
        frameW: WebGLUniformLocation | null
        frameH: WebGLUniformLocation | null
        time: WebGLUniformLocation | null
    }
}

function loadShader(type: number, source: string) {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`)
        gl.deleteShader(shader)
        return null
    }
    return shader
}

function initShaderProgram(vsSource: string, fsSource: string) {
    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource)
    if (!vertexShader) return null
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource)
    if (!fragmentShader) return null

    const shaderProgram = gl.createProgram()
    if (!shaderProgram) return null
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`)
        return null
    }

    return shaderProgram
}

function initPositionBuffer(): WebGLBuffer | null {
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    //gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    return positionBuffer
}

function initCameraBuffer(): WebGLBuffer | null {
    const uniformBuffer = gl.createBuffer()
    const data = new Float32Array([cam.loc.arr4(), cam.dir.arr4(), cam.right.arr4(), cam.up.arr4(), cam.matrView.m.flat()].flat())
    const size = data.byteLength
    gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffer)
    gl.bufferData(gl.UNIFORM_BUFFER, size, gl.STATIC_DRAW)
    gl.bindBufferRange(gl.UNIFORM_BUFFER, 0, uniformBuffer, 0, size)

    gl.uniformBlockBinding(programInfo.program, gl.getUniformBlockIndex(programInfo.program, 'CameraBlock'), 0)

    gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffer)
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, data)
    gl.bindBuffer(gl.UNIFORM_BUFFER, null)

    return uniformBuffer
}
interface Buffers {
    position: WebGLBuffer | null
    camera: WebGLBuffer | null
}

function initBuffers(): Buffers {
    return {
        position: initPositionBuffer(),
        camera: initCameraBuffer()
    }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(buffers: Buffers, programInfo: ProgramInfo) {
    const numComponents = 2 // pull out 2 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    const offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset)
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
}
export async function compileShader(worldMap: string = generateWorldMap() as string) {
    const vsResponse = await fetch('./march.vertex.glsl')
    const vsText = await vsResponse.text()
    console.log(vsText)
    const fsResponse = await fetch('./march.fragment.glsl')
    let fsText = await fsResponse.text()

    if (!worldMap) worldMap = 'Col(0.0, vec3(0.0))' //'Sphere(p, vec3(0), 1.)'

    // Replace the constant with the actual data
    fsText = fsText.replace('WORLD_MAP', worldMap)

    console.log(fsText)
    const shaderProgram = initShaderProgram(vsText, fsText)
    if (!shaderProgram) return

    programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'in_pos')
        },
        uniformLocations: {
            frameW: gl.getUniformLocation(shaderProgram, 'frameW'),
            frameH: gl.getUniformLocation(shaderProgram, 'frameH'),
            time: gl.getUniformLocation(shaderProgram, 'time')
        }
    }
    buffers = initBuffers()
}
let canvas: HTMLCanvasElement

export async function init() {
    canvas = document.querySelector('#glcanvas') as HTMLCanvasElement
    if (!canvas) {
        alert('No canvas element!!!')
        return
    }

    gl = canvas.getContext('webgl2') as WebGL2RenderingContext

    // Only continue if WebGL is available and working
    if (gl === null) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.')
        return
    }
    await compileShader()
}
export function render() {
    gl.clearColor(0.8, 0.47, 0.3, 1.0)
    gl.clearDepth(1.0) // Clear everything

    gl.enable(gl.DEPTH_TEST) // Enable depth testing
    gl.depthFunc(gl.LEQUAL) // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    setPositionAttribute(buffers, programInfo)

    gl.useProgram(programInfo.program)

    gl.bindBuffer(gl.UNIFORM_BUFFER, buffers.camera)
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, new Float32Array([cam.loc.arr4(), cam.dir.arr4(), cam.right.arr4(), cam.up.arr4(), cam.matrView.m.flat()].flat()))

    gl.uniform1i(programInfo.uniformLocations.frameW, canvas.width)
    gl.uniform1i(programInfo.uniformLocations.frameH, canvas.height)
    gl.uniform1i(programInfo.uniformLocations.time, Date.now()) // not sure

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    ControlCamera()

    //buffers.camera
    //gl.deleteBuffer(camBuffer)
    window.requestAnimationFrame(render)
}
