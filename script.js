import "./style.css";
import * as THREE from "three";
import gsap from 'gsap'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("canvas.webgl");
console.log(canvas);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
const renderer = new THREE.WebGL1Renderer({ canvas: canvas, antialias: true });
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader()
const controls = new OrbitControls(camera, canvas);
const clock = new THREE.Clock()
const axesHelper = new THREE.AxesHelper(10)

const planeBakedTex = textureLoader.load('plane-baked.jpg')
const polymanBakedTex = textureLoader.load('polyman-baked.jpg')
planeBakedTex.flipY = false
polymanBakedTex.flipY = false
const planeMaterial = new THREE.MeshBasicMaterial({ map: planeBakedTex })
const polymanMaterial = new THREE.MeshBasicMaterial({ map: polymanBakedTex })

let gltfLoaded;

gltfLoader.load('scene.glb', (gltf) => {

    const plane = gltf.scene.children.find(child => child.name === 'Plane')
    const polyman = gltf.scene.children.find(child => child.name === 'PolyMan')
    plane.material = planeMaterial
    polyman.material = polymanMaterial
    console.log(plane, polyman);

    
    console.log(gltf.scene);
    scene.add(gltf.scene)
    camera.lookAt(5, 3, 0)
    gltf.scene.rotation.y = 8
    gltf.scene.add(axesHelper)
    gltfLoaded = gltf.scene

})
scene.add(camera);
camera.position.set(5, 30, -10);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

controls.enableDamping = true;

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    console.log(sizes.width);

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

let time = Date.now()

scene.pos

const tick = () =>
{

    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    const elapsedTime = clock.getElapsedTime()

    if(gltfLoaded) {
        gltfLoaded.rotation.y += 0.0001 * deltaTime
        gsap.to(camera.position, { duration: 5, delay: 0.25, y: 8, ease: "slow(0.7, 0.7, false)"})
    }

    
    
    camera.lookAt(5, 3, 0)
    console.log('tick')
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()