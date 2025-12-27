import maplibregl, { MapMouseEvent, NavigationControl } from 'maplibre-gl'
import { useEffect, useState } from 'react'
import * as React from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let map: maplibregl.Map
const MAPTILER_KEY = 'vnMHW6qNNaDNdgWfAhge'

function addControls(map: maplibregl.Map) {
    map.addControl(
        new NavigationControl({
            visualizePitch: true
        })
    )
    map.addControl(
        new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
    )
    // pixels the map pans when the up or down arrow is clicked
    const deltaDistance = 100

    // degrees the map rotates when the left or right arrow is clicked
    const deltaDegrees = 25

    function easing(t: number) {
        return t * (2 - t)
    }
    map.getCanvas().addEventListener(
        'keydown',
        (e) => {
            e.preventDefault()
            if (e.which === 38) {
                // up
                map.panBy([0, -deltaDistance], {
                    easing
                })
            } else if (e.which === 40) {
                // down
                map.panBy([0, deltaDistance], {
                    easing
                })
            } else if (e.which === 37) {
                // left
                map.easeTo({
                    bearing: map.getBearing() - deltaDegrees,
                    easing
                })
            } else if (e.which === 39) {
                // right
                map.easeTo({
                    bearing: map.getBearing() + deltaDegrees,
                    easing
                })
            }
        },
        true
    )
}
async function addBomb(map: maplibregl.Map) {
    const image = await map.loadImage(
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png'
    )
    map.addImage('cat', image.data)
    map.addSource('point', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [0, 0]
                    },
                    properties: null
                }
            ]
        }
    })

    map.addLayer({
        id: 'explosion',
        type: 'symbol',
        source: 'point',
        layout: {
            'icon-image': 'cat',
            'icon-size': 0.25
        }
    })
}

function addBuildings(map: maplibregl.Map) {
    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers

    let labelLayerId
    for (const layer of layers) {
        if (
            layer.type === 'symbol' &&
            layer.layout != undefined &&
            layer.layout['text-field']
        ) {
            labelLayerId = layer.id
            break
        }
    }

    map.addSource('buildings', {
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
        type: 'vector'
    })
    map.addLayer(
        {
            id: '3d-buildings',
            source: 'buildings',
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
                'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'render_height'],
                    0,
                    'lightgray',
                    200,
                    'royalblue',
                    400,
                    'lightblue'
                ],
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    16,
                    ['get', 'render_height']
                ],
                'fill-extrusion-base': [
                    'case',
                    ['>=', ['get', 'zoom'], 16],
                    ['get', 'render_min_height'],
                    0
                ]
            }
        },
        labelLayerId
    )
}
function addModel(map: maplibregl.Map) {
    // parameters to ensure the model is georeferenced correctly on the map
    const modelOrigin: maplibregl.LngLatLike = [30, 60]
    const modelAltitude = 0
    const modelRotate = [Math.PI / 2, 0, 0]

    const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
        modelOrigin,
        modelAltitude
    )

    // transformation parameters to position, rotate and scale the 3D model onto the map
    const modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        /* Since our 3D model is in real world meters, a scale transform needs to be
         * applied since the CustomLayerInterface expects units in MercatorCoordinates.
         */
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 100
    }

    const camera = new THREE.Camera()
    const scene = new THREE.Scene()
    let renderer: THREE.WebGLRenderer
    // configuration of the custom layer for a 3D model per the CustomLayerInterface
    const customLayer: maplibregl.AddLayerObject = {
        id: '3d-model',
        type: 'custom',
        renderingMode: '3d',
        onAdd(map, gl) {
            // create two three.js lights to illuminate the model
            const directionalLight = new THREE.DirectionalLight(0xffffff)
            directionalLight.position.set(0, -70, 100).normalize()
            scene.add(directionalLight)

            const directionalLight2 = new THREE.DirectionalLight(0xffffff)
            directionalLight2.position.set(0, 70, 100).normalize()
            scene.add(directionalLight2)

            // use the three.js GLTF loader to add the 3D model to the three.js scene
            const loader = new GLTFLoader()
            loader.load(
                'https://maplibre.org/maplibre-gl-js/docs/assets/34M_17/34M_17.gltf',
                (gltf) => {
                    scene.add(gltf.scene)
                }
            )

            // use the MapLibre GL JS map canvas for three.js
            renderer = new THREE.WebGLRenderer({
                canvas: map.getCanvas(),
                context: gl,
                antialias: true
            })
            renderer.autoClear = false
        },
        render(gl, matrix) {
            const rotationX = new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(1, 0, 0),
                modelTransform.rotateX
            )
            const rotationY = new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(0, 1, 0),
                modelTransform.rotateY
            )
            const rotationZ = new THREE.Matrix4().makeRotationAxis(
                new THREE.Vector3(0, 0, 1),
                modelTransform.rotateZ
            )

            const m = new THREE.Matrix4().fromArray(matrix)
            const l = new THREE.Matrix4()
                .makeTranslation(
                    modelTransform.translateX,
                    modelTransform.translateY,
                    modelTransform.translateZ
                )
                .scale(
                    new THREE.Vector3(
                        modelTransform.scale,
                        -modelTransform.scale,
                        modelTransform.scale
                    )
                )
                .multiply(rotationX)
                .multiply(rotationY)
                .multiply(rotationZ)

            camera.projectionMatrix = m.multiply(l)
            renderer.resetState()
            renderer.render(scene, camera)
            map.triggerRepaint()
        }
    }
    map.addLayer(customLayer)
}
export function MapComponent(props: {
    onLeftClick: (event: MapMouseEvent, map: maplibregl.Map) => void
    onRightClick: (event: MapMouseEvent, map: maplibregl.Map) => void
}) {
    //const [tagReady, setTagReady] = useState(false)
    const [[w, h], setWH] = useState([window.innerWidth, window.innerHeight])
    useEffect(() => {
        const marker = new maplibregl.Marker()

        map = new maplibregl.Map({
            container: 'map',
            center: [30.278, 59.9432],
            zoom: 6,
            style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
            maxPitch: 85
        })
        map.on('click', (e) => {
            marker.setLngLat(e.lngLat)
            props.onLeftClick(e, map)
        })
        map.on('contextmenu', (e) => props.onRightClick(e, map))

        map.on('load', async () => {
            marker.setLngLat([30.278, 59.9432]).addTo(map)
            addBomb(map)
            addBuildings(map)
            addControls(map)
            addModel(map)
        })
        window.addEventListener('resize', (e) => {
            setWH([window.innerWidth, window.innerHeight])
        })
    }, [])
    return (
        <div
            //ref={() => setTagReady(true)}
            style={{ width: w, height: h }}
            id="map"
        />
    )
}
