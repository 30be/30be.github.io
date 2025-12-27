import { HdrWeak } from "@mui/icons-material";
import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { ColladaLoader, TransformControls } from "three/examples/jsm/Addons.js";

// Render is just a single window that draws a single object group
export class Render {
  private ready = false;

  private readonly renderer = new THREE.WebGLRenderer({ antialias: true });
  private readonly camera = new THREE.PerspectiveCamera(70);
  private readonly scene = new THREE.Scene();

  private readonly defaultLight = new THREE.DirectionalLight();
  private readonly defaultLight2 = new THREE.AmbientLight();
  private readonly axesHelper = new THREE.AxesHelper(5);
  private controls: TrackballControls;

  private readonly raycaster = new THREE.Raycaster();
  private readonly mousePointer = new THREE.Vector2();
  private cgsgModel: THREE.Object3D;
  private rootModel: null | THREE.Object3D = null;

  set primitives(value: THREE.Object3D | null) {
    if (this.rootModel == value) return;
    if (this.rootModel) this.rootModel.removeFromParent();

    if (value === null || value.children.length == 0) this.rootModel = this.cgsgModel;
    else this.rootModel = value;

    if (this.rootModel) this.scene.add(this.rootModel);
  }

  private intersected: THREE.Object3D | null = null;
  private transformControls: TransformControls;

  /* Far/near clip events */
  setFarClip = (num: number) => {
    this.camera.far = num;
    this.camera.updateProjectionMatrix();
  };
  setNearClip = (num: number) => {
    this.camera.near = num;
    this.camera.updateProjectionMatrix();
  };

  resize(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
  constructor() {
    this.renderer.setAnimationLoop(() => this.animate());

    this.camera.position.z = 5;
    this.defaultLight.rotateX(47);
    this.scene.add(this.defaultLight, this.defaultLight2, this.axesHelper);
    this.scene.background = new THREE.Color(0x696969);

    this.initRaycaster();
    this.addCGSGModel();
  }
  initWindow(divId: string) {
    /* Set up div`s */
    const div = document.getElementById(divId);
    if (!div) {
      alert("Div for threejs does not exist");
      return;
    }

    div.appendChild(this.renderer.domElement);
    this.controls = new TrackballControls(this.camera, this.renderer.domElement); // This line needs to be after the element

    /* Set up renderer*/
    this.resize(div.clientWidth, div.clientHeight);

    // This thing is not safe to call more than once, this is a bug.
    window.addEventListener("resize", () => {
      this.resize(div.clientWidth, div.clientHeight);
    });

    div.addEventListener("click", () => this.intersect());
    this.ready = true;
  }
  private initRaycaster() {
    this.renderer.domElement.addEventListener("pointermove", (event) => {
      this.mousePointer.x = ((event.pageX - this.renderer.domElement.offsetLeft) / this.renderer.domElement.clientWidth) * 2 - 1;
      this.mousePointer.y = -((event.pageY - this.renderer.domElement.offsetTop) / this.renderer.domElement.clientHeight) * 2 + 1;
    });
  }

  private intersect() {
    /* TODO add intersection logic; connect it with the resources panel
    this.raycaster.setFromCamera(this.mousePointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, false);

    if (intersects.length > 0) {
      if (this.intersected != intersects[0].object) {
        if (this.intersected) this.intersected.material.emissive.setHex(this.intersected.currentHex);

        this.intersected = intersects[0].object;
        this.intersected.currentHex = this.intersected.material.emissive.getHex();
        this.intersected.material.emissive.setHex(0xff0000);
      }
    } else {
      if (this.intersected) this.intersected.material.emissive.setHex(this.intersected.currentHex);

      this.intersected = null;
    }
    this.transformControls.attach(selected...);/// otherwise detach
    */
  }

  private addCGSGModel() {
    new ColladaLoader().load("bin/cgsg.dae", (collada) => {
      this.primitives = collada.scene;
    });
  }

  private animate() {
    if (!this.ready) return;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
