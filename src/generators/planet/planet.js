import earthTexture from '../../img/earth_atmos_2048.jpg'
import earthSpecular from '../../img/earth_specular_2048.jpg'
import earthNormal from '../../img/earth_normal_2048.jpg'

export function generatePlanet() {
  const terrain = generate()
  render(terrain)
}

function generate() {
  var xS = 427, yS = 127;
  const options = {
    easing: THREE.Terrain.Brownian,
    frequency: 2.5,
    heightmap: THREE.Terrain.DiamondSquare,
    material: new THREE.MeshBasicMaterial({color: 0x5566aa}),
    maxHeight: 100,
    minHeight: -100,
    steps: 1,
    useBufferGeometry: false,
    xSegments: xS,
    xSize: 1024,
    ySegments: yS,
    ySize: 1024,
    edgeType: 'radial',
    after
  }
  const terrain = THREE.Terrain(options)
  const canvas = THREE.Terrain.toHeightmap(
      terrain.children[0].geometry.vertices,
      options
  )
  console.log(canvas)
  document.body.appendChild(canvas)
  const img = canvas.toDataURL('image/png')
  console.log(img)
  return img
}

    function after(vertices, options) {
      THREE.Terrain.RadialEdges( // or THREE.Terrain.RadialEdges(
        vertices,
        options,
        true, // true turns the edges up; false turns them down
        1, // how far from the edge the curvature should start
        THREE.Terrain.EaseInOut // or another curve function
      );
    };

function render(map) {
  const textureLoader = new THREE.TextureLoader();
  var camera, scene
  var geometry, material

  const radius = 6371
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 50, 1e7)
  camera.position.z = radius * 3
 
  scene = new THREE.Scene()
 
  geometry = new THREE.SphereGeometry(radius, 80, 60)
  material = new THREE.MeshPhongMaterial({
    specular: 0x333333,
    shininess: 15,
    map: textureLoader.load(map),
    specularMap: textureLoader.load(map),
    normalMap: textureLoader.load(map),
    normalScale: new THREE.Vector2( 0.85, 0.85 )
  })
 
  const star = new THREE.DirectionalLight(0xffffff)
  star.position.set(-1, 0, 1).normalize()

  const planet = new THREE.Mesh(geometry, material)
  scene.add(planet)
  scene.add(star)

  const renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setSize(window.innerWidth - 100, window.innerHeight)
  //document.getElementsByTagName('canvas')[0] && document.getElementsByTagName('canvas')[0].remove()
  document.body.appendChild(renderer.domElement)
  animate()

  function animate() {
    requestAnimationFrame(animate)
    planet.rotation.y += 0.005
    renderer.render(scene, camera)
  }
}