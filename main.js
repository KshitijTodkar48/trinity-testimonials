import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Audio context
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/

const ctx = new (window.AudioContext)();
const mobile = window.matchMedia("(max-width: 985px)").matches;
/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Loading Manager
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
const LoadingPage = document.getElementById('loader')
const MainPage = document.getElementById('main-page')
const progressBar = document.querySelector('.loading-progress')
const percentage = document.querySelector('.loading-percentage')

const musicBarsDiv = document.querySelector('.music-bars')
const musicBars = document.querySelectorAll('.stroke');


if (mobile) {
    musicBarsDiv.style.display = 'none';
}

let SoundPlaying = false;
musicBarsDiv.addEventListener('click', () => {
  ctx.resume()
    if (!SoundPlaying) {
        for (let i = 0; i < 5; i++) {
            musicBars[i].style.animationPlayState = 'running'
        }
        background.play();
        SoundPlaying = true;
    }
    else {
        for (let i = 0; i < 5; i++) {
            musicBars[i].style.animationPlayState = 'paused';
        }
        background.pause();
        SoundPlaying = false;
    }
})


const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        // Wait a little
        window.setTimeout(() => {
            // Update loadingBarElement
            LoadingPage.style.display = 'none'
            MainPage.style.display = 'block';
          
        }, 500)
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = (itemsLoaded / itemsTotal) * 250;
        progressBar.style.width = `${progressRatio}px`
        percentage.innerHTML = Math.round(progressRatio / 2.5) + ' %';
    }
)


/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Asset Loader
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
const textureLoader = new THREE.TextureLoader(loadingManager);
textureLoader.load('/nav-bar-logo.png')
textureLoader.load('/acm-rscoe-logo.png')

/*
=====================================================================================
                Cursor
=====================================================================================
*/
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
  cursor.x = (event.clientX / sizes.width) * 2 - 1
  cursor.y = -1 * (event.clientY / sizes.height) * 2 + 1
})
/*
=====================================================================================
                CANVAS
=====================================================================================
*/
const canvas = document.querySelector('canvas.webgl')
/*
=====================================================================================
                SCENE
=====================================================================================
*/
const scene = new THREE.Scene()
/*
=====================================================================================
                RYACASTE
=====================================================================================
*/
const raycaster = new THREE.Raycaster()

/*
=====================================================================================
                GEOMETRY
=====================================================================================
*/


const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 400, 70, 70),
  new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: true,
    vertexColors: true
  })
)
planeMesh.rotation.x = -0.4

/*
=====================================================================================
                Randomize Vertex setting
=====================================================================================
*/
const PlaneVertexArray = planeMesh.geometry.attributes.position.array;
const randomValues = []
for (let i = 0; i < PlaneVertexArray.length; i++) {
  if (i % 3 == 0) {
    const x = PlaneVertexArray[i];
    const y = PlaneVertexArray[i + 1];
    const z = PlaneVertexArray[i + 2];
    PlaneVertexArray[i] = x + (Math.random() - 0.5) * 3
    PlaneVertexArray[i + 1] = y + (Math.random() - 0.5) * 3
    PlaneVertexArray[i + 2] = z + (Math.random() - 0.5) * 3
  }

  randomValues.push(Math.random() * Math.PI * 2 - 0.5)
}

planeMesh.geometry.attributes.position.originalPositions = planeMesh.geometry.attributes.position.array;
planeMesh.geometry.attributes.position.randomValues = randomValues

/*
=====================================================================================
                Color setting
=====================================================================================
*/
const colors = [];
const vertexCount = planeMesh.geometry.attributes.position.count;
for (let i = 0; i < vertexCount; i++) {
  colors.push(0.070, 0.074, 0.08);
}
planeMesh.geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(new Float32Array(colors), 3)
)
scene.add(planeMesh)

/*
=====================================================================================
                LIGHT
=====================================================================================
*/
const light = new THREE.DirectionalLight(0xffffff, 0.7)
light.position.set(0, 1, 1)
scene.add(light);
/*
=====================================================================================
                RESIZE
=====================================================================================
*/
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/*
=====================================================================================
                CAMERA
=====================================================================================
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 50
scene.add(camera)

/*
=====================================================================================
                AUDIO
=====================================================================================
*/
// instantiate a listener
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

// instantiate audio object
const hoverSound = new THREE.Audio(audioListener);
const clickSound = new THREE.Audio(audioListener);
const background = new THREE.Audio(audioListener);
scene.add(hoverSound);
scene.add(clickSound);
scene.add(background);

// instantiate a loader
const loader = new THREE.AudioLoader(loadingManager);
loader.load(
    // resource URL
    '/audio/hover.mp3',
    // onLoad callback
    function (audioBuffer) {
        // set the audio object buffer to the loaded object
        hoverSound.setBuffer(audioBuffer);
        hoverSound.setVolume(0.5);
    }
);
loader.load(
    // resource URL
    '/audio/rclick.mp3',
    // onLoad callback
    function (audioBuffer) {
        // set the audio object buffer to the loaded object
        clickSound.setBuffer(audioBuffer);
        clickSound.setVolume(1);
    }
);


loader.load(
    // resource URL
    '/audio/background.mp3',
    // onLoad callback
    function (audioBuffer) {
        // set the audio object buffer to the loaded object
        background.setBuffer(audioBuffer);
        background.setLoop(true);
    }
);

let obj1 = document.getElementById('obj-1');
let obj2 = document.getElementById('obj-2');

if (!mobile) {
  obj1.addEventListener('mouseenter', () => {  ctx.resume(); hoverSound.play() })
  obj2.addEventListener('mouseenter', () => {  ctx.resume(); hoverSound.play() })
  
}
obj1.addEventListener('click', () => {  ctx.resume(); clickSound.play() })
obj2.addEventListener('click', () => {  ctx.resume(); clickSound.play() })

/*
=====================================================================================
                RENDERER
=====================================================================================
*/
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/*
=====================================================================================
                ANIMATION
=====================================================================================
*/
let frame = 0;
const clock = new THREE.Clock()
const tick = () => {
  frame += 0.01
  const elapsedTime = clock.getElapsedTime()
  // Upadte camera
  camera.position.x = cursor.x * 0.1;
  camera.position.y = cursor.y * 0.1;


  // Animate vertex of plane
  let motion_factor = 0.007
  const PlaneVertexArray = planeMesh.geometry.attributes.position.array;
  const originalPositions = planeMesh.geometry.attributes.position.originalPositions;
  const randomValues = planeMesh.geometry.attributes.position.randomValues

  for (let i = 0; i < PlaneVertexArray.length; i += 3) {
    // X vertex
    PlaneVertexArray[i] = originalPositions[i] + Math.cos(frame + randomValues[i]) * motion_factor;
    // Y vertex
    PlaneVertexArray[i + 1] = originalPositions[i + 1] + Math.sin(frame + randomValues[i]) * motion_factor;
  }
  planeMesh.geometry.attributes.position.needsUpdate = true;



  // Raycaster
  raycaster.setFromCamera(cursor, camera)
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const newColor = intersects[0].object.geometry.attributes.color
    // VERTEX 1
    newColor.setX(intersects[0].face.a, 0.454)
    newColor.setY(intersects[0].face.a, 0.267)
    newColor.setZ(intersects[0].face.a, 1)
    // VERTEX 2
    newColor.setX(intersects[0].face.b, 0.454)
    newColor.setY(intersects[0].face.b, 0.267)
    newColor.setZ(intersects[0].face.b, 1)
    // VERTEX 3
    newColor.setX(intersects[0].face.c, 0.454)
    newColor.setY(intersects[0].face.c, 0.267)
    newColor.setZ(intersects[0].face.c, 1)
    newColor.needsUpdate = true;

    const initColor = {
      r: 0.070,
      g: 0.074,
      b: 0.08
    }
    const hoverColor = {
      r: 0.454,
      g: 0.267,
      b: 1
    }
    gsap.to(hoverColor, {
      r: initColor.r,
      g: initColor.g,
      b: initColor.b,
      onUpdate: () => {
        // VERTEX 1
        newColor.setX(intersects[0].face.a, hoverColor.r)
        newColor.setY(intersects[0].face.a, hoverColor.g)
        newColor.setZ(intersects[0].face.a, hoverColor.b)
        // VERTEX 2
        newColor.setX(intersects[0].face.b, hoverColor.r)
        newColor.setY(intersects[0].face.b, hoverColor.g)
        newColor.setZ(intersects[0].face.b, hoverColor.b)
        // VERTEX 3
        newColor.setX(intersects[0].face.c, hoverColor.r)
        newColor.setY(intersects[0].face.c, hoverColor.g)
        newColor.setZ(intersects[0].face.c, hoverColor.b)
        newColor.needsUpdate = true;
      }
    })
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
