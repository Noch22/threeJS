import './style.css';
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DirectionalLightHelper, SpotLightHelper, HemisphereLightHelper } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GridHelper, AxesHelper } from "three";

// 🌟 Initialisation de la scène
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2.051131972104984, 4.487554891288987, 4.77019404208107); // Position initiale de la caméra

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );





// // 🌟 Ajout de la grille (taille 10, divisions 10)
// const gridHelper = new GridHelper(10, 10);
// scene.add(gridHelper);

// // (Optionnel) Ajout des axes XYZ pour repères
// const axesHelper = new AxesHelper(2); // 2 = taille des axes
// scene.add(axesHelper);

// 🌟 Lumières
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(2, 2, 5);
scene.add(dirLight);

// 🌟 Lumière Spot (comme un projecteur)
const spotLight = new THREE.SpotLight(0x00ff00, 10, 10, Math.PI / 12, 0.5, 2);
spotLight.position.set(100, 0, 10);
scene.add(spotLight);

// 🌟 Lumière hémisphérique (ambiance)
const hemiLight = new THREE.HemisphereLight(0x4040ff, 0xff4040, 1);
scene.add(hemiLight);

const spotLight2 = new THREE.SpotLight( 0xffffff, 100 );
spotLight2.position.set( 0, 9, 0 );
spotLight2.angle = 10000;
spotLight2.penumbra = 1;
spotLight2.decay = 2;
spotLight2.distance = 0;

spotLight2.castShadow = true;
spotLight2.shadow.mapSize.width = 1024;
spotLight2.shadow.mapSize.height = 1024;
spotLight2.shadow.camera.near = 1;
spotLight2.shadow.camera.far = 10;
spotLight2.shadow.focus = 1;
scene.add( spotLight2 );


// 🌟 Chargement du modèle GLTF
let model, jc; // Déclare la variable en dehors pour pouvoir l'utiliser dans l'event listener
const loader = new GLTFLoader();
loader.load("/~buissonn/noah.glb", (gltf) => {
  model = gltf.scene;
  scene.add(model);
  model.scale.set(0.005, 0.005, 0.005); // Réduit à 50% de la taille originale
  model.position.set(0, 0, 0);
}, undefined, (error) => {
  console.error("Erreur de chargement du modèle :", error);
});

loader.load("/~buissonn/jc.glb", (gltf) => {
  jc = gltf.scene;
  scene.add(jc);
  jc.scale.set(6, 6, 6); // Réduit à 50% de la taille originale
  jc.position.set(5, -1.5, 0);
}, undefined, (error) => {
  console.error("Erreur de chargement du modèle :", error)
});

// 🌟 Animation de la scène
let angle = 0; // Angle initial de la caméra autour de l'objet
const radius = 3; // Distance de la caméra de l'objet

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (model) {
    // Calcul de la nouvelle position de la caméra en coordonnées polaires
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    
    // Mise à jour de la position de la caméra
    // camera.position.set(x, 5, z);
    
    // La caméra regarde toujours vers l'objet
    model.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.01);
    jc.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.01);
  }

  renderer.render(scene, camera);
}
animate();

// 🌟 Redimensionner le canvas lorsque la fenêtre change de taille
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
