import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Group } from "three";

const canvas = document.querySelector("canvas.webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
const renderer = new THREE.WebGL1Renderer({ canvas: canvas, antialias: true });
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const controls = new OrbitControls(camera, canvas);
const clock = new THREE.Clock();
const axesHelper = new THREE.AxesHelper(10);
const axesHelper2 = new THREE.AxesHelper(8);
const cameraHelper = new THREE.CameraHelper(camera);
const mainGroup = new THREE.Group();

const planeBakedTex = textureLoader.load("plane-baked.jpg");
const polymanBakedTex = textureLoader.load("polyman-baked.jpg");
planeBakedTex.encoding = THREE.sRGBEncoding;
polymanBakedTex.encoding = THREE.sRGBEncoding;
planeBakedTex.flipY = false;
polymanBakedTex.flipY = false;
const planeMaterial = new THREE.MeshBasicMaterial({ map: planeBakedTex });
const polymanMaterial = new THREE.MeshBasicMaterial({ map: polymanBakedTex });

let gltfLoaded;
let plane;
let polyman;
let cubeMesh;

gltfLoader.load("scene.glb", (gltf) => {
  plane = gltf.scene.children.find((child) => child.name === "Plane");
  plane.receiveShadow = true;
  polyman = gltf.scene.children.find((child) => child.name === "PolyMan");
  plane.material = planeMaterial;
  polyman.material = polymanMaterial;
  polyman.add(axesHelper);

  gltfLoaded = gltf.scene;

  const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: "red" });
  cubeMaterial.transparent = true;
  cubeMaterial.opacity = 0;
  cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial);
  cubeMesh.position.set(0, 21, 21);
  gltf.scene.add(cubeMesh);

  mainGroup.add(plane);
  mainGroup.add(cubeMesh);
});

let mixer;
let fbxmodel;
let animationModel;

const ambient = new THREE.AmbientLight(0x404040);
const hemilight = new THREE.HemisphereLight(0x6d9ce8, 0x1d3152, 0.05);
const directionalLight = new THREE.DirectionalLight(0x2d498c, 0.5);
directionalLight.position.set(20, 30, -30);
directionalLight.castShadow = true;
const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLight, dirLightHelper);

scene.add(hemilight);

const fbxloader = new FBXLoader();
const animeLoader = new FBXLoader();
fbxloader.load("polyman.fbx", (fbx) => {
  fbxmodel = fbx;
  fbx.traverse((child) => {
    child.castShadow = true;
  });
  const polyman = fbx.children.find((child) => child.name === "PolyMan");
  fbx.rotation.y = Math.PI;
  animeLoader.load("polyman-anime.fbx", (animation) => {
    animationModel = animation;
    mixer = new THREE.AnimationMixer(fbx);
    const idle = mixer.clipAction(animation.animations[0]);
    idle.play();
    console.log(polyman);
    mainGroup.add(fbx);
  });
  scene.add(fbx);
});

mainGroup.add(directionalLight);
scene.add(mainGroup);

scene.add(camera, cameraHelper);
camera.position.set(0, 7, 7);
// camera.position.set(0,21,21)

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.render(scene, camera);

controls.enableDamping = true;
controls.enabled = true;
controls.autoRotate = false;
// controls.autoRotateSpeed = 5
controls.target.set(-3, 3, 0);

// Resize Event Listener
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 'Enter Here' Event Listener
document.querySelector("#button").addEventListener("click", () => {
  document.styleSheets[0].cssRules[3].style.opacity = 0;
  rotationEnabled = false;
  controls.enabled = false;
  gsap.to(controls.target, { x: 0, duration: 2 });

  if (gltfLoaded) {
    const vec3cube = new THREE.Vector3();
    const vec3cam = new THREE.Vector3();
    cubeMesh.getWorldPosition(vec3cube);
    camera.getWorldPosition(vec3cam);
    console.log(vec3cube.x, vec3cube.y, vec3cube.z);
    console.log(vec3cam.x, vec3cam.y, vec3cam.z);
    gsap.to(camera.position, {
      x: vec3cube.x,
      y: vec3cube.y,
      z: vec3cube.z,
      duration: 3,
    });
  }
});

let time = Date.now();

let rotationEnabled = true;

let playingStateCamera = new THREE.Vector3(15, 10, 0); // This Camera Position enabled when user agent is 'playing'. (Except the Y should be set to 10 or so)

const tick = () => {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  if (fbxmodel && animationModel) {
    mixer.update(clock.getDelta());
  }

  // Rotation Animation
  if (gltfLoaded && rotationEnabled) {
    mainGroup.rotation.y += 0.0003 * deltaTime;
  }

  renderer.render(scene, camera);
  controls.update();

  window.requestAnimationFrame(tick);
};

tick();

// Camera Position and Direction when 'playing' state is active
//      camera.lookAt(polyman.position.x, polyman.position.y + 3, polyman.position.z)
//      camera.position.set(15, 10, 0);
