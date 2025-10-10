/* G3DM models loader class implementation */
import { BufferGeometry, FileLoader, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments, Loader, Material, Mesh, MeshPhongMaterial, Points, PointsMaterial, Vector3, Color, Texture, DataArrayTexture, RGBAFormat, FloatType, BufferAttribute, DefaultLoadingManager, DoubleSide } from "three";
import { Geometry } from "three/examples/jsm/deprecated/Geometry.js";
import * as THREE from "three";

class Rdr {
  private index = 0;
  private data: ArrayBuffer;
  private decoder = new TextDecoder();

  constructor(data: ArrayBuffer) {
    this.data = data;
  }
  uint = () => new Uint32Array(this.data.slice(this.index, (this.index += 4)))[0];
  uintArray = (size) => new Uint32Array(this.data.slice(this.index, (this.index += size * 4)));
  floatArray = (size) => new Float32Array(this.data.slice(this.index, (this.index += size * 4)));
  float = () => new Float32Array(this.data.slice(this.index, (this.index += 4)))[0];
  string = (size: number) => this.decoder.decode(this.data.slice(this.index, (this.index += size)));
  texture = (w: number, h: number, c: number) => new Uint8Array(this.data.slice(this.index, (this.index += w * h * c)));
  skip = (size: number) => (this.index += size);
  reset = () => (this.index = 0);
  color = () => new Color(...new Float32Array(this.data.slice(this.index, (this.index += 12))));

  skipPrimitives(primNumber: number) {
    for (let prim = 0; prim < primNumber; prim++) {
      const vertexNumber = this.uint();
      const indexNumber = this.uint();
      const materialIndex = this.uint();
      this.skip(vertexNumber * 4 * 12);
      this.skip(indexNumber * 4);
    }
  }
  skipMaterials(materialNumber: number) {
    const materialSize = 300 + 4 * 3 * 3 + 4 + 4 + 4 * 8 + 300 + 4;
    this.skip(materialSize * materialNumber);
  }
}

/* https://cgsg.pml30.ru/srcview.php?src=/cgsg/2022-23/SumCamp/Jr/menu/materials/0802/T06ANIM_G3DM.cpp */
class G3DMLoader extends Loader<Group> {
  materials: Material[] = [];
  textures: Texture[] = [];
  result = new Group();

  parse(data: ArrayBuffer, modelName: string): Group {
    const reader = new Rdr(data);
    if (reader.string(4) != "G3DM") alert("G3DM model is incorrect!");
    const primNumber = reader.uint();
    const materialNumber = reader.uint();
    const textureNumber = reader.uint();

    /* Skip to the textures */
    reader.skipPrimitives(primNumber);
    reader.skipMaterials(materialNumber);

    /* Fill textures */
    for (let texture = 0; texture < textureNumber; texture++) {
      const name = reader.string(300);
      const width = reader.uint();
      const height = reader.uint();
      const components = reader.uint();

      /* Load texture data */
      const texData = reader.texture(width, height, components);
      const newTexture = new THREE.DataTexture(texData, width, height, THREE.RGBAFormat);
      newTexture.needsUpdate = true;
      newTexture.name = name;
      // newTexture.format = components === 4 ? RGBAFormat : THREE.RGBFormat;
      // newTexture.type = FloatType;
      // newTexture.name = name;
      // newTexture.colorSpace = THREE.SRGBColorSpace;
      this.textures.push(newTexture);
    }

    /* Go to the materials */
    reader.reset();
    reader.skip(16);
    reader.skipPrimitives(primNumber);

    /* Decode materials */
    for (let mtl = 0; mtl < materialNumber; mtl++) {
      const nameStr = reader.string(300),
        myEmissive = reader.color(),
        myColor = reader.color(),
        mySpecular = reader.color(),
        myShininess = reader.float(),
        myOpacity = reader.float();

      let textureLoaded;
      for (let tex = 0; tex < 8; tex++) {
        const texIndex = reader.uint();
        if (texIndex != 4294967295 && texIndex != -1 && tex == 0) textureLoaded = this.textures[texIndex];
      }

      const newMaterial = new MeshPhongMaterial({
        //emissive: myEmissive,
        color: myColor,
        specular: mySpecular,
        shininess: myShininess,
        opacity: myOpacity,
        transparent: myOpacity != 1,
        map: textureLoaded,
        side: THREE.DoubleSide,
        //name: nameStr,
      });

      reader.skip(304); // Shader + index
      this.materials.push(newMaterial);
    }

    reader.reset();
    reader.skip(16);

    /* Decode primitives */
    for (let prim = 0; prim < primNumber; prim++) {
      const verticeNumber = reader.uint();
      const indexNumber = reader.uint();
      const materialIndex = reader.uint();

      const geometry = new BufferGeometry();
      //const vertices = Array.from({ length: verticeNumber }, () => [3, 2, 3, 4].map((i) => reader.floatArray(i)));
      //console.log("vertices ", vertices); // All fine here
      const attributeArrays: Array<Array<number>> = [[], [], [], []];
      /*
      for (let vertex of vertices)
        vertex.forEach((vec, index) => {
          //console.log("vec: ", ...vec); works ok!
          attributeArrays[index].push(...vec);
        });*/
      //console.log("verticeNumber: " + verticeNumber);

      for (let i = 0; i < verticeNumber; i++) {
        attributeArrays[0].push(...reader.floatArray(3));
        attributeArrays[1].push(...reader.floatArray(2));
        attributeArrays[2].push(...reader.floatArray(3));
        attributeArrays[3].push(...reader.floatArray(4));
        //attributeArrays[3].pop();
      }
      geometry.setAttribute("position", new BufferAttribute(new Float32Array(attributeArrays[0]), 3));
      geometry.setAttribute("uv", new BufferAttribute(new Float32Array(attributeArrays[1]), 2));
      geometry.setAttribute("normal", new BufferAttribute(new Float32Array(attributeArrays[2]), 3));
      geometry.setAttribute("color", new BufferAttribute(new Float32Array(attributeArrays[3]), 4));

      /*
      Array.from({ length: verticeNumber }, () => [3, 2, 3, 4].map((i) => reader.floatArray(i)))
        .reduce((acc, val) => acc.map((attribArray, i) => attribArray.concat(...val[i])), Array<Array<number>>(4).fill([]))
        .forEach((attribArray, i) => geometry.setAttribute(["position", "uv", "normal", "color"][i], new BufferAttribute(new Float32Array(attribArray), [3, 2, 3, 4][i])));
 */
      geometry.setIndex(Array.from(reader.uintArray(indexNumber)));

      //console.log("attributes", verticeNumber, attributeArrays); // !!!!
      //console.log("position", verticeNumber, geometry.attributes["position"]); // !!!!
      //console.log("index ", indexNumber, geometry.index);
      const primitive = new Mesh(geometry, this.materials[materialIndex]);
      primitive.name = modelName + prim;
      this.result.add(primitive);
    }
    return this.result; // TODO set name after it is loaded
  }
}

export { G3DMLoader };
