import { SavedSearchSharp } from "@mui/icons-material";
import * as THREE from "three";
import { bufferAttribute } from "three/examples/jsm/nodes/accessors/BufferAttributeNode.js";
import { color } from "three/examples/jsm/nodes/Nodes.js";

interface StringValue {
  type: "s";
  value: string;
  size: number;
}
interface UintValue {
  type: "u";
  value: number;
}
interface IntValue {
  type: "i";
  value: number;
}
interface FloatValue {
  type: "f";
  value: number;
}
interface UINTArray {
  type: "ua";
  value: Array<number>;
}
interface FloatArray {
  type: "fa";
  value: Array<number>;
}
interface ByteArray {
  type: "ba";
  value: Uint8Array;
}
interface Color {
  type: "c";
  value: THREE.Color;
}
type ValueT = StringValue | UintValue | IntValue | FloatValue | UINTArray | FloatArray | ByteArray | Color;

/* This is a very badly implemented saver. Much better would be to make functions like savePrim and add to an array of arrays of typed elements, and then pass it to file as-is. */
class Saver {
  private buffer = new Array<ValueT>();
  private size = 0;
  pushs = (s: string, size = 300) => ((this.size += size), this.buffer.push({ type: "s", value: s, size: size }) - 1);
  pushu = (s: number) => ((this.size += 4), this.buffer.push({ type: "u", value: s }) - 1);
  pushi = (s: number) => ((this.size += 4), this.buffer.push({ type: "i", value: s }) - 1);
  pushf = (s: number) => ((this.size += 4), this.buffer.push({ type: "f", value: s }) - 1);
  pushua = (s: number[]) => ((this.size += s.length * 4), this.buffer.push({ type: "ua", value: s }) - 1);
  pushfa = (s: number[]) => ((this.size += s.length * 4), this.buffer.push({ type: "fa", value: s }) - 1);
  pushba = (v: Uint8Array) => ((this.size += v.length), this.buffer.push({ type: "ba", value: v }) - 1);
  pushc = (v: THREE.Color) => ((this.size += 12), this.buffer.push({ type: "c", value: v }) - 1);
  compile(): ArrayBuffer {
    //const decoder =
    const result = new ArrayBuffer(this.size);
    const uint8Result = new Uint8Array(result);
    const uint32Result = new Uint32Array(result);
    const float32Result = new Float32Array(result);
    uint8Result.fill(0);
    const view = new DataView(result);
    let byteOffset = 0; // TODO: What endian should it be?
    for (let el of this.buffer) {
      switch (el.type) {
        case "s":
          const stringBytes = new TextEncoder().encode(el.value); //if alerted, 71, 51, 68, 77; = G3DM - ok!
          uint8Result.set(stringBytes, byteOffset);
          byteOffset += el.size;
          break;
        case "u":
          view.setUint32(byteOffset, el.value, true);
          byteOffset += 4;
          break;
        case "i":
          view.setInt32(byteOffset, el.value, true);
          byteOffset += 4;
          break;
        case "f":
          view.setFloat32(byteOffset, el.value, true);
          byteOffset += 4;
          break;
        case "ua":
          uint32Result.set(el.value, byteOffset / 4);
          byteOffset += 4 * el.value.length;
          break;
        case "fa":
          float32Result.set(el.value, byteOffset / 4);
          byteOffset += 4 * el.value.length;
          break;
        case "ba":
          uint8Result.set(el.value, byteOffset); // Hardcore copy
          byteOffset += el.value.length * el.value.BYTES_PER_ELEMENT;
          break;
        case "c":
          float32Result.set([el.value.r, el.value.g, el.value.b], byteOffset / 4);
          byteOffset += 12;
          break;
      }
    }
    if (byteOffset != this.size) alert("Logical error in exporter!");
    this.buffer.length = 0;
    this.size = 0;
    return result;
  }
}
export function exportG3DM(primGroup: THREE.Group, materials: THREE.Material[], textures: THREE.Texture[], fileName: string) {
  const saver = new Saver();
  // TODO: Implement some kind of a tree-sitter not to save unused textures here.
  saver.pushs("G3DM", 4);
  saver.pushu(primGroup.children.length);
  saver.pushu(materials.length);
  saver.pushu(textures.length);

  //const materialIndices = new Array<number>();
  for (let primitive of primGroup.children) {
    try {
      if ((primitive as THREE.Mesh).isMesh) {
        const mesh = primitive as THREE.Mesh;

        //if (mesh.geometry.attributes["uv"] == undefined)

        const positions = mesh.geometry.attributes["position"];
        let texCoords = mesh.geometry.attributes["uv"];
        let normals = mesh.geometry.attributes["normal"];
        let colors = mesh.geometry.attributes["color"];
        let indices = mesh.geometry.index;

        if (positions == undefined) {
          alert("Positions of the mesh are undefined, which is strange. Skipping primitive.");
          continue;
        }
        if (texCoords == undefined) texCoords = new THREE.BufferAttribute(new Float32Array((positions.array.length / 3) * 2).fill(0), 2);
        if (normals == undefined) normals = new THREE.BufferAttribute(new Float32Array(positions.array.length).fill(0), 3);
        if (colors == undefined) colors = new THREE.BufferAttribute(new Float32Array((positions.array.length / 3) * 4).fill(0), 4);

        if (indices == null) indices = new THREE.BufferAttribute(new Uint32Array(positions.array.length / 3), 1);

        saver.pushu(positions.count);
        saver.pushu(indices.count);
        let materialIndex = materials.findIndex((mtl) => mtl.id == (mesh.material as THREE.Material).id); // TODO Get to know when Material can be an array
        if (materialIndex == -1) {
          materialIndex = 0;
          alert("Material does not exist in the list; logical error!(multi-material primitives are not supported (yet)) - writing first in the collection"); // Maybe there are some kind of materialId? TODO: Check MMD
          //continue;
        }
        saver.pushu(materialIndex);
        // TODO: Collada may not contain a color(?)
        // Add checks for this
        for (let i = 0; i < positions.count; i++) {
          saver.pushfa(Array.from(positions.array.slice(i * 3, (i + 1) * 3))); // * mesh.matrixWorld
          saver.pushfa(Array.from(texCoords.array.slice(i * 2, (i + 1) * 2)));
          saver.pushfa(Array.from(normals.array.slice(i * 3, (i + 1) * 3))); // TODO mult by reverse transpose mesh.matrixWorld
          saver.pushfa(Array.from(colors.array.slice(i * 4, (i + 1) * 4)));
        }
        saver.pushua(Array.from(indices.array));
      }
    } catch (e) {
      alert("error: " + e + "; Skipping primitive " + primitive.name + " (id: " + primitive.id + ")");
      continue;
    }
  }
  for (let material of materials) {
    let ka = (material as THREE.MeshPhongMaterial).emissive;
    let kd = (material as THREE.MeshPhongMaterial).color;
    let ks = (material as THREE.MeshPhongMaterial).specular;
    let ph = (material as THREE.MeshPhongMaterial).shininess;
    const tr = 1 - (material as THREE.MeshPhongMaterial).opacity;

    if (ka == undefined) ka = new THREE.Color();
    if (kd == undefined) kd = new THREE.Color();
    if (ks == undefined) ks = new THREE.Color();
    if (ph == undefined) ph = 30;

    saver.pushs(material.name); // TODO: If material name is missing, write index or auto-generate...
    saver.pushc(ka);
    saver.pushc(kd);
    saver.pushc(ks);
    saver.pushf(ph);
    saver.pushf(tr);
    const TexturesIndex = textures.findIndex((tex) => tex.id == (material as THREE.MeshPhongMaterial).map?.id);
    saver.pushi(TexturesIndex);
    for (let i = 0; i < 7; i++) saver.pushi(-1); // TODO: It is actually very important and useful as of a project to save specular in a defined, documented manner.
    saver.pushs("");
    saver.pushi(0);
    break;
  }
  for (let texture of textures) {
    saver.pushs(texture.name); // TODO: If texture name is missing, write index or auto-generate...

    // TODO texture.saveTM2();

    saver.pushu(texture.image.width);
    saver.pushu(texture.image.height);
    saver.pushu(4); // Wrong!
    saver.pushba(new Uint8Array(texture.image.width * texture.image.height * texture.image.width * 4)); // Zeroes
  }
  console.log("Exporting finished!");

  const blob = saver.compile();
  console.log(blob);
  const file = new File([blob], fileName);

  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName; // set the filename
  a.click();
  URL.revokeObjectURL(url);

  // TNSP - omitted...
}
