import * as THREE from "three";
import { ColladaLoader, FBXLoader, FontLoader, GLTF, GLTFExporter, GLTFLoader, MMDLoader, Rhino3dmLoader } from "three/examples/jsm/Addons.js";
import { G3DMLoader } from "./Loaders/g3dmLoader";
import { exportG3DM } from "./Loaders/g3dmExporter";

export const modelTypes = ["g3dm", "dae", "gltf", "obj"] as const;
export type ModelType = (typeof modelTypes)[number];

export class Resources {
  materials: THREE.Material[] = [];
  textures: THREE.Texture[] = []; // TODO, Maybe wrapper will be needed
  primitives = new THREE.Group();

  /* File parsing function */
  async addFile(file: File, requestFile: (fileName: string) => Promise<File | null>) {
    const extension = file.name.match(/\.([a-z0-9]+)$/i)?.[0].substring(1);
    if (extension === undefined) return undefined;
    /* Works, but the only thing i can do is to redirect url to somewhere else.
    const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src")?.set;
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      set: function (url: string) {
        if (url.includes("model-resource")) {
          alert("Ha!");
          url = "my";
        }
        if (originalSrcSetter) originalSrcSetter.call(this, url);
      },
    });
*/

    // WARNING | Buggy, specific, dangerous bad code.s
    const originalCreateElementNS = document.createElementNS.bind(document);
    document.createElementNS = function (bs: string, tagName: string) {
      const basicElement = originalCreateElementNS(bs, tagName);

      const oldAddEvenListener = basicElement.addEventListener.bind(basicElement);
      let savedLoadListener: (this: HTMLImageElement, ev: Event) => any;
      basicElement.addEventListener = (type: string, listener: (this: HTMLImageElement, ev: Event) => any, options?: boolean | AddEventListenerOptions) => {
        //alert(type); - load or error.

        // !!!!!!!!! WARNING !!!!!!!!!!!!
        // This code )ONLY works in the scope of https://github.com/mrdoob/three.js/blob/master/src/loaders/ImageLoader.js

        if (type == "load") {
          savedLoadListener = listener;
        } else if (type == "error") {
          const savedErrorListener = listener;
          listener = function (this: HTMLImageElement, ev: Event) {
            requestFile(this.src).then((texFile) => {
              if (texFile === null) {
                savedErrorListener.bind(basicElement)(ev);
                return;
              }
              basicElement.src = new FileReader().readAsDataURL(texFile);
              // TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
              // Manual loading of the image from the src
              //...
              savedLoadListener.bind(basicElement)(ev);
            });
          };
        }
        oldAddEvenListener(type, listener, options);
        ////////////////// https://github.com/mrdoob/three.js/blob/master/src/loaders/ImageLoader.js
        // What happened:
        // 1)	image.addEventListener( 'load', onImageLoad, false ); -> i save listener as savedLoadListener
        // 2) image.addEventListener( 'error', onImageError, false ); -> i rewrite their error function as their load function
        //
      };
      return basicElement;
    }; // I noow think that the much better option would be to overwrite THREEJS ImageLoader prototype

    window.addEventListener("load", async () => {});
    try {
      let res: THREE.Object3D;
      switch (extension) {
        case "dae":
          const loader = new ColladaLoader();
          res = loader.parse(await file.text(), "model-resource").scene;
          break;
        case "fbx":
          res = new FBXLoader().parse(await file.text(), "");
          break;
        case "g3dm":
          res = new G3DMLoader().parse(await file.arrayBuffer(), file.name);
          break;
        case "gltf":
          const gltf = await new Promise<GLTF>((resolve) => {
            file.text().then((text) => new GLTFLoader().parse(text, "", (gltf) => resolve(gltf)));
          });
          res = gltf.scene;
          break;
        case "pmd": // MikuMiku
        case "pmx":
          res = await new Promise((resolve) => new MMDLoader().load(URL.createObjectURL(file), resolve));
          break;
        default:
          alert("Unsupported model type: " + extension);
          return;
      }
      this.addFlat(res);
    } catch (e) {
      alert("There was an issue reading the file: " + e);
      throw e;
    }
    document.createElementNS = originalCreateElementNS;
  }

  private addFlat(rootObject: THREE.Object3D) {
    while (rootObject.children.length != 0) {
      this.addFlat(rootObject.children[0]);
    }
    const mesh = rootObject as THREE.Mesh;
    if (!mesh.isMesh) {
      rootObject.removeFromParent();
      return;
    }
    console.log("added mesh!");
    //primitive.name = `#${prim} from "${prim.name}"`; // TODO: add auto naming with custom(g3dm) index
    this.primitives.add(mesh); // removes from parent

    if (!this.materials.find((mtl) => (mesh.material as THREE.Material).id == mtl.id)) {
      this.materials.push(Array.isArray(mesh.material) ? mesh.material[0] : mesh.material);
    }
    /* Add texture */
    const importTex = (mesh.material as THREE.MeshBasicMaterial | THREE.MeshPhongMaterial).map;
    if (importTex !== null) {
      if (!this.textures.find((tex) => importTex.id === tex.id)) {
        this.textures.push(importTex);
      }
    }
  }

  export(type: ModelType) {
    switch (type) {
      case "g3dm":
        exportG3DM(this.primitives, this.materials, this.textures, "exported." + type);
        break;
      case "gltf":
        new GLTFExporter().parse(
          this.primitives,
          (blob) => {
            let file;
            if (blob instanceof ArrayBuffer) {
              file = new File([blob], "loaded_scene.gltf");
            } else {
              file = new File([JSON.stringify(blob)], "loaded_scene.gltf");
            }
            const url = URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = url;
            a.download = "loaded_scene.gltf";
            a.click();
            URL.revokeObjectURL(url);
          },
          () => {}
        );
        break;
      default:
        alert("Not supported type was tried to be called!");
        break;
    }
  }
}
