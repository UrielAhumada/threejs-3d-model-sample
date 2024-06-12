// Importamos las bibliotecas necesarias de Three.js.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Creamos un renderizador WebGL con antialiasing para suavizar los bordes.
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace; // Configuramos el espacio de color de salida.

// Configuramos el tamaño del renderizador para que ocupe toda la ventana.
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); // Establecemos el color de fondo en negro.
renderer.setPixelRatio(window.devicePixelRatio); // Ajustamos la relación de píxeles para pantallas de alta densidad.

// Habilitamos las sombras en el renderizador.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Usamos un tipo de sombra suave.

// Añadimos el elemento del renderizador al documento HTML.
document.body.appendChild(renderer.domElement);

// Creamos una nueva escena.
const scene = new THREE.Scene();

// Creamos una cámara en perspectiva.
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11); // Posicionamos la cámara.

// Creamos controles de órbita para la cámara.
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Habilitamos el amortiguamiento para un movimiento más suave.
controls.enablePan = false; // Deshabilitamos el paneo de la cámara.
controls.minDistance = 5; // Distancia mínima de zoom.
controls.maxDistance = 20; // Distancia máxima de zoom.
controls.minPolarAngle = 0.5; // Ángulo polar mínimo.
controls.maxPolarAngle = 1.5; // Ángulo polar máximo.
controls.autoRotate = false; // Deshabilitamos la rotación automática.
controls.target = new THREE.Vector3(0, 1, 0); // Establecemos el objetivo de los controles.
controls.update(); // Actualizamos los controles.

// Creamos un plano para el suelo.
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2); // Rotamos el plano para que sea horizontal.
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555, // Color gris.
  side: THREE.DoubleSide // Renderizamos ambos lados del plano.
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = false; // El suelo no proyecta sombras.
groundMesh.receiveShadow = true; // El suelo recibe sombras.
scene.add(groundMesh); // Añadimos el suelo a la escena.

// Creamos una luz direccional tipo foco con mayor intensidad y color azul rey.
const spotLight = new THREE.SpotLight(0xffffff, 5000, 200, 0.22, 1);
spotLight.position.set(0, 25, 0); // Posicionamos la luz.
spotLight.castShadow = true; // La luz proyecta sombras.
spotLight.shadow.bias = -0.0001; // Ajustamos el sesgo de las sombras para evitar artefactos.
scene.add(spotLight); // Añadimos la luz a la escena.

// Creamos una segunda luz direccional tipo foco a 70 grados. 
const spotLight2 = new THREE.SpotLight(0x4169E1, 5000, 200, 0.22, 1);
spotLight2.position.set(0, 35, 0); // Posicionamos la luz.
spotLight2.castShadow = true; // La luz proyecta sombras.
spotLight2.shadow.bias = -0.0001; // Ajustamos el sesgo de las sombras para evitar artefactos.
scene.add(spotLight2); // Añadimos la luz a la escena.

// Creamos un cargador GLTF para cargar modelos 3D.
const loader = new GLTFLoader().setPath('public/millennium_falcon/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene; // Obtenemos el modelo cargado.

  // Recorremos todos los hijos del modelo.
  mesh.traverse((child) => {
    if (child.isMesh) { // Si el hijo es una malla.
      child.castShadow = true; // Permitimos que proyecte sombras.
      child.receiveShadow = true; // Permitimos que reciba sombras.
    }
  });

  mesh.position.set(0, 1.05, -1); // Posicionamos el modelo.
  scene.add(mesh); // Añadimos el modelo a la escena.

  // Ocultamos el contenedor de progreso.
  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  // Mostramos el progreso de la carga del modelo.
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  // Mostramos cualquier error que ocurra durante la carga.
  console.error(error);
});

// Añadimos un evento para manejar el redimensionamiento de la ventana.
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight; // Actualizamos el aspecto de la cámara.
  camera.updateProjectionMatrix(); // Actualizamos la matriz de proyección de la cámara.
  renderer.setSize(window.innerWidth, window.innerHeight); // Actualizamos el tamaño del renderizador.
});

// Función de animación que se ejecuta en cada frame.
function animate() {
  requestAnimationFrame(animate); // Llamamos a esta función en el siguiente frame.
  controls.update(); // Actualizamos los controles.
  renderer.render(scene, camera); // Renderizamos la escena desde la perspectiva de la cámara.
}

// Llamamos a la función de animación por primera vez para iniciar el bucle.
animate();