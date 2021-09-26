// -------------
//   LEVEL 3
// -------------


//------------
//  * Level base variables

var BackgroundColor = 0x000000;
var BackGround_Img  = '../assets/scene/textures/Level3_canvas.png';

var SPEED = 1.25;
var obsDistance = 2.0;
var collisionDistance = 1.55;

//------------
//  * Textures
const txloader = new THREE.TextureLoader();

const bg_Img = txloader.load(BackGround_Img);

const world_diff = txloader.load("../assets/scene/textures/level3/Lava_001_COLOR.png");
const world_norm = txloader.load("../assets/scene/textures/level3/Lava_001_NRM.png");
const world_roug = txloader.load("../assets/scene/textures/level3/Lava_001_SPEC.png");
const world_disp = txloader.load("../assets/scene/textures/level3/Lava_001_DISP.png");
world_diff.wrapS = THREE.RepeatWrapping; world_diff.wrapT = THREE.RepeatWrapping; world_diff.repeat.set( 8, 8 );

const fence_diff = txloader.load("../assets/scene/textures/level3/lava_5_diff.jpg");
const fence_norm = txloader.load("../assets/scene/textures/level3/lava_5_norm.jpg");
const fence_roug = txloader.load("../assets/scene/textures/level3/lava_5_rough.jpg");
const fence_disp = txloader.load("../assets/scene/textures/level3/lava_5_disp.jpg");
fence_diff.wrapS = THREE.RepeatWrapping; fence_diff.wrapT = THREE.RepeatWrapping; fence_diff.repeat.set( 16, 16 );
fence_norm.wrapS = THREE.RepeatWrapping; fence_norm.wrapT = THREE.RepeatWrapping; fence_norm.repeat.set( 16, 16 );
fence_roug.wrapS = THREE.RepeatWrapping; fence_roug.wrapT = THREE.RepeatWrapping; fence_roug.repeat.set( 16, 16 );
fence_disp.wrapS = THREE.RepeatWrapping; fence_disp.wrapT = THREE.RepeatWrapping; fence_disp.repeat.set( 16, 16 );

//const wall_block_diff = txloader.load("../assets/scene/textures/level3/rocks_ground_02_col_1k.jpg");
//const wall_block_norm = txloader.load("../assets/scene/textures/level3/rocks_ground_02_nor_gl_1k.jpg");
//const wall_block_roug = txloader.load("../assets/scene/textures/level3/rocks_ground_02_rough_1k.jpg");

const wall_block_diff = txloader.load("../assets/scene/textures/level3/Lava_004_COLOR.jpg");
const wall_block_norm = txloader.load("../assets/scene/textures/level3/Lava_004_NORM.jpg");
const wall_block_roug = txloader.load("../assets/scene/textures/level3/Lava_004_ROUGH.jpg");

const trunk_diff = txloader.load("../assets/scene/textures/level3/Lava_002_COLOR.png");
const trunk_norm = txloader.load("../assets/scene/textures/level3/Lava_002_NRM.png");
const trunk_spec = txloader.load("../assets/scene/textures/level3/Lava_002_SPEC.png");
const trunk_ambi = txloader.load("../assets/scene/textures/level3/Lava_002_OCC.png");
trunk_diff.wrapS = THREE.RepeatWrapping; trunk_diff.wrapT = THREE.RepeatWrapping; trunk_diff.repeat.set( 2, 2 );
trunk_norm.wrapS = THREE.RepeatWrapping; trunk_norm.wrapT = THREE.RepeatWrapping; trunk_norm.repeat.set( 2, 2 );
trunk_spec.wrapS = THREE.RepeatWrapping; trunk_spec.wrapT = THREE.RepeatWrapping; trunk_spec.repeat.set( 2, 2 );
trunk_ambi.wrapS = THREE.RepeatWrapping; trunk_ambi.wrapT = THREE.RepeatWrapping; trunk_ambi.repeat.set( 2, 2 );


//------------
//  * Lights 

//var sun = new THREE.DirectionalLight( 0xffffff, 0.8);
//sun.position.set( 0, 40, 1 );
//sun.castShadow = true;
//scene.add(sun);

var light1 = new THREE.PointLight(0xf22a2a, 0.5, 250); // (color; intensity; distance; decay)
light1.position.set( 10, 10, 5 );
light1.castShadow = false;

var light2 = new THREE.PointLight(0xffd966, 0.5, 250); // (color; intensity; distance; decay)
light2.position.set(-10, 10, 5 );
light2.castShadow = false;

var dirLight1 = new THREE.DirectionalLight(0xffffff, 1); // (color; intensity)
dirLight1.position.set(-1, 25, 5);
dirLight1.castShadow = true;
dirLight1.shadow.mapSize.width = 2048; dirLight1.shadow.mapSize.height = 2048;
dirLight1.shadow.camera.left = -70; dirLight1.shadow.camera.right = 70;
dirLight1.shadow.camera.top = 70; dirLight1.shadow.camera.bottom = -70;

var sunlight = new THREE.AmbientLight(0xffffff, 0.9); // (color; intensity)
dirLight1.castShadow = false;

var lightTorch = new THREE.PointLight(0xffffff, 0.0, 5); // (color; intensity; distance; decay)

// -------------------------
// **** WORLD OBJs

// ** Ground
var sides=40; var tiers=40; var worldRadius = 100.0;
var worldGeometry = new THREE.DodecahedronGeometry( worldRadius, sides, tiers);
var worldBaseMat = new THREE.MeshStandardMaterial( { color: "#2b5329" ,flatShading:THREE.FlatShading} )
var worldMaterial = new THREE.MeshStandardMaterial( { 
    //color: "#2b5329",
    map: world_diff,
    //normalMap: world_norm,
    //roughnessMap: world_roug,
    //displacementMap: world_roug,
    flatShading:THREE.FlatShading,
} )

rollingGroundWorld = new THREE.Mesh( worldGeometry, worldMaterial );
rollingGroundWorld.position.y = -101; rollingGroundWorld.position.z = 0;
rollingGroundWorld.rotation.x = Math.PI/2;
rollingGroundWorld.receiveShadow = true;

// ** Boundaries
var cyl_fence_geometry = new THREE.CylinderGeometry( 105, 105, 2, 54);
var cyl_fence_base_mat = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
var cyl_fence_material = new THREE.MeshStandardMaterial( { 
    map: fence_diff,
    normalMap: fence_norm,
    roughnessMap: fence_roug,
    displacementMap: fence_roug,
 } );

var torus_fence_geometry = new THREE.TorusGeometry( 100, 1, 16, 100 );
var torus_fence_base_mat = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
var torus_fence_material = new THREE.MeshStandardMaterial( { 
    color: 0xffff00,
    normalMap: wall_block_norm,
    roughnessMap: wall_block_roug,
} );

var fenceL = new THREE.Mesh( cyl_fence_geometry, cyl_fence_material );
fenceL.position.y = -101; fenceL.position.x = -5.5;
fenceL.rotation.z = Math.PI/2; // 'Y' if Torus , 'Z' if Cylinder
fenceL.castShadow = true; fenceL.receiveShadow = true;

var fenceR = new THREE.Mesh( cyl_fence_geometry, cyl_fence_material );
fenceR.position.y = -101; fenceR.position.x = +5.5;
fenceR.rotation.z = Math.PI/2; // 'Y' if Torus , 'Z' if Cylinder
fenceR.castShadow = true; fenceR.receiveShadow = true;

// * Scenary

var BackGround_1, BackGround_2;
var BackGround_Cloud_1, BackGround_Cloud_2, BackGround_Cloud_3;

// --Clouds--
var cloud_geometry = new THREE.CylinderGeometry( radius=101, widthSegments=5, thetaLength= 3 );
var cloud_material = new THREE.MeshStandardMaterial( { 
    normalMap: wall_block_norm,
    roughnessMap: wall_block_roug,
} );

var Cloud = new THREE.Group();

const tuft1_geo = new THREE.SphereGeometry(1.5,7,8); tuft1_geo.translate(-2,0,0);
tuft1 = new THREE.Mesh(tuft1_geo, new THREE.MeshStandardMaterial({ color:'#161616', flatShading:true, }))
const tuft2_geo = new THREE.SphereGeometry(1.5,7,8); tuft2_geo.translate(2,0,0); 
tuft2 = new THREE.Mesh(tuft2_geo, new THREE.MeshStandardMaterial({ color:'#151111', flatShading:true, }))
const tuft3_geo = new THREE.SphereGeometry(2.0,7,8); tuft3_geo.translate(0,0,0);
tuft3 = new THREE.Mesh(tuft3_geo, new THREE.MeshStandardMaterial({ color:'#131111', flatShading:true, }))
Cloud.add(tuft1); Cloud.add(tuft2); Cloud.add(tuft3);
Cloud.castShadow = true; Cloud.receiveShadow = true;

// remap value from the range of [smin,smax] to [emin,emax]
const map = (val, smin, smax, emin, emax) => (emax-emin)*(val-smin)/(smax-smin) + emin
//randomly displace the x,y,z coords by the `per` value
const jitter = (cloud, per) => {
    cloud.position.x += map(Math.random(),0,1,-per,per)
    cloud.position.y += map(Math.random(),0,1,-per,per)
    cloud.position.z += map(Math.random(),0,1,-per,per)
}
const chopBottom = (cloud,bottom) => cloud.position.y = Math.max(cloud.position.y, bottom)

jitter(Cloud, 0.2); chopBottom(Cloud,-0.5);

BackGround_Cloud_1 = Cloud.clone(); 
BackGround_Cloud_1.scale.x = 5.0; 
BackGround_Cloud_1.position.x = -25.0; BackGround_Cloud_1.position.y = 16.0; BackGround_Cloud_1.position.z = -30.0;
BackGround_Cloud_2 = Cloud.clone();
BackGround_Cloud_2.scale.x = 5.0; BackGround_Cloud_2.scale.y = 1.5;  
BackGround_Cloud_2.position.x = +25.0; BackGround_Cloud_2.position.y = 10.0; BackGround_Cloud_2.position.z = -40.0;
BackGround_Cloud_3 = Cloud.clone(); 
BackGround_Cloud_3.scale.x = 10.0; BackGround_Cloud_3.scale.y = 2.5;  
BackGround_Cloud_3.position.x = +15.0; BackGround_Cloud_3.position.y = 45.0; BackGround_Cloud_3.position.z = -50.0;

var BG_scene = new THREE.Group();
BG_scene.add(BackGround_Cloud_1); BG_scene.add(BackGround_Cloud_2); BG_scene.add(BackGround_Cloud_3);

// --Tree model--
const Tree = new THREE.Group();

var kernel_geometry = new THREE.DodecahedronGeometry( 1.0, 1);
var kernel_material = new THREE.MeshStandardMaterial({ 
    color: "#8b522a", 
    map: trunk_diff,
    normalMap: trunk_norm,
});
var kernel_mesh = new THREE.Mesh(kernel_geometry, kernel_material);
kernel_mesh.castShadow = true; kernel_mesh.receiveShadow = true;
kernel_mesh.position.y = 0;
Tree.add(kernel_mesh);

var tail_geometry = new THREE.CylinderGeometry( 0, 0.2, 3.5, 6 );
var tail_material = new THREE.MeshStandardMaterial({ 
    color: "#ffd966",
    map: trunk_diff,
    normalMap: fence_norm,
    roughnessMap: fence_roug,
});
var tail_mesh_1 = new THREE.Mesh(tail_geometry, tail_material);
tail_mesh_1.castShadow = true; tail_mesh_1.receiveShadow = true;
tail_mesh_1.position.x = 0.3; tail_mesh_1.position.y = 1.7; tail_mesh_1.position.z = -1.7; 
tail_mesh_1.rotation.x=-Math.PI/6;
//tail_mesh.rotation.y=-Math.PI/3;
kernel_mesh.add(tail_mesh_1);

var tail_mesh_2 = new THREE.Mesh(tail_geometry, tail_material);
tail_mesh_2.castShadow = true; tail_mesh_2.receiveShadow = true;
tail_mesh_2.position.x = -0.3; tail_mesh_2.position.y = 1.3; tail_mesh_2.position.z = -1.5; 
tail_mesh_2.rotation.x=-Math.PI/6;
//tail_mesh.rotation.y=-Math.PI/3;
kernel_mesh.add(tail_mesh_2);

var tail_mesh_3 = new THREE.Mesh(tail_geometry, tail_material);
tail_mesh_3.castShadow = true; tail_mesh_3.receiveShadow = true;
tail_mesh_3.position.x = 0.0; tail_mesh_3.position.y = 1.8; tail_mesh_3.position.z = -0.7; 
tail_mesh_3.rotation.x=-Math.PI/6;
//tail_mesh.rotation.y=-Math.PI/3;
kernel_mesh.add(tail_mesh_3);


// **** OBJECTS
var collidableMeshList = new Array();
  
// ----------
// COLUMNS
var wall_geometry = new THREE.BoxGeometry(0.0, 2.5, 0.0);
var wall_material = new THREE.MeshStandardMaterial( {color: "#A020F0"} );

// column mesh
var wall_column = new THREE.Mesh( wall_geometry, wall_material);
wall_column.castShadow = false; wall_column.receiveShadow = false;
wall_column.add(Tree);

var wall_column_2 = new THREE.Mesh( wall_geometry, wall_material);
wall_column.castShadow = false; wall_column.receiveShadow = false;
    
// ----------
// LOW BLOCKS
var block_geometry = new THREE.IcosahedronGeometry(1.1, 0);
var block_base_geometry = new THREE.BoxGeometry(1.0, 2.0, 1.0);
var block_material = new THREE.MeshStandardMaterial( {
    //color: "#8b522a",
    map: wall_block_diff,
    normalMap: wall_block_norm,
    roughnessMap: wall_block_roug,
} );

// low block mesh
    var wall_block = new THREE.Mesh( block_geometry, block_material );
    wall_block.position.y  = 0.5; wall_block.rotation.y  = Math.PI/4;
    wall_block.castShadow = true; wall_block.receiveShadow = true;

// -- LOADERs

const gltfLoader = new THREE.GLTFLoader();
const tree0_url = '../assets/scene/models/Tree0.glb';

var glb_LoadModel = function (obj, _ulr){   
    gltfLoader.load(_ulr, (glb) => {
    model = glb.scene;
    model.position.y = -1.3; model.rotation.y = 0;
	//console.log(model.position)
    model.castShadow = true; model.receiveShadow = true;
    
    obj.add(model);
    });
}

// ================================================================
// ** FUNCTIONS **

var init_settings = function(){

    glb_LoadModel(wall_2, tree0_url);
    glb_LoadModel(wall_3, tree0_url);
        
}

var levelBG_animations = function(){

    light_animations(light1, 1, 1);
    light_animations(light2, 1, 1);

	slide_animations(BackGround_Cloud_1, 1, 70, BackGround_Cloud_1); 
	slide_animations(BackGround_Cloud_2,-1, 70, BackGround_Cloud_1);
	slide_animations(BackGround_Cloud_3,-1, 70, BackGround_Cloud_1);

    //block2_animations(wall_2);
    block2_animations(wall_1.children[0]);
    block2_animations(wall_6.children[0]);
    
}

var flickering_factor = 0.01;
var light_animations = function(obj, dir, limit){
	if (obj.intensity > limit) flickering_factor = -flickering_factor;
	obj.intensity += dir * flickering_factor;
}

var bg_slide_factor = 0.01;
var slide_animations = function(obj, dir, limit, objRef){
	if (objRef.position.x > limit) obj.position.x = -obj.position.x;
	obj.position.x += dir * bg_slide_factor;
}
var block1_animations = function(obj){
    obj.rotation.x -= 0.1;
} 

var block2_animations = function(obj){
	if (obj.position.y < 0.2) obj.position.y=1;
    obj.position.y -= 0.001 * speedUpBrowser;
}


// ================================================================
var MODELS = {

    BackgroundColor,
    SPEED, obsDistance, collisionDistance,

    light1,
    dirLight1,
    sunlight,
    lightTorch,

    rollingGroundWorld,

    cyl_fence_geometry, cyl_fence_material,
    torus_fence_geometry, torus_fence_material,
    fenceL, fenceR,

    bg_Img,
    BackGround_1, BackGround_2,
    BackGround_Cloud_1, BackGround_Cloud_2, BackGround_Cloud_3,
    Tree,

    collidableMeshList,

    wall_geometry, wall_material,
    wall_column,

    block_geometry, block_material,
    wall_block,

};