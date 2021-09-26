// -------------
//   LEVEL 1
// -------------


//------------
//  * Level base variables

var BackgroundColor = 0x92a9b2;
var BackGround_Img  = '../assets/scene/textures/Level1_canvas.png';

var SPEED = 1.0;
var obsDistance = 1.0;
var collisionDistance = 1.4;

//------------
//  * Textures
const txloader = new THREE.TextureLoader();

const bg_Img = txloader.load(BackGround_Img);

const world_diff = txloader.load("../assets/scene/textures/level1/forest_leaves_02_diffuse_1k.jpg");
const world_norm = txloader.load("../assets/scene/textures/level1/forest_leaves_02_nor_gl_1k.jpg");
const world_roug = txloader.load("../assets/scene/textures/level1/forest_leaves_02_rough_1k.jpg");
world_diff.wrapS = THREE.RepeatWrapping; world_diff.wrapT = THREE.RepeatWrapping; world_diff.repeat.set( 8, 8 );

const fence_diff = txloader.load("../assets/scene/textures/level1/aerial_rocks_04_diff_1k.jpg");
const fence_norm = txloader.load("../assets/scene/textures/level1/aerial_rocks_04_nor_gl_1k.jpg");
const fence_roug = txloader.load("../assets/scene/textures/level1/aerial_rocks_04_rough_1k.jpg");
fence_diff.wrapS = THREE.RepeatWrapping; fence_diff.wrapT = THREE.RepeatWrapping; fence_diff.repeat.set( 16, 16 );
fence_norm.wrapS = THREE.RepeatWrapping; fence_norm.wrapT = THREE.RepeatWrapping; fence_norm.repeat.set( 16, 16 );
fence_roug.wrapS = THREE.RepeatWrapping; fence_roug.wrapT = THREE.RepeatWrapping; fence_roug.repeat.set( 16, 16 );

const wall_block_diff = txloader.load("../assets/scene/textures/level1/rocks_ground_02_col_1k.jpg");
const wall_block_norm = txloader.load("../assets/scene/textures/level1/rocks_ground_02_nor_gl_1k.jpg");
const wall_block_roug = txloader.load("../assets/scene/textures/level1/rocks_ground_02_rough_1k.jpg");

const trunk_diff = txloader.load("../assets/scene/textures/level1/bark_brown_02_diff_1k.jpg");
const trunk_norm = txloader.load("../assets/scene/textures/level1/bark_brown_02_nor_gl_1k.jpg");
const trunk_roug = txloader.load("../assets/scene/textures/level1/bark_brown_02_rough_1k.jpg");



//------------
//  * Lights - level 1

var light1 = new THREE.PointLight(0xFFFFFF, 0.75, 250); // (color; intensity; distance; decay)
light1.position.set( 20, 15, 5 );
light1.castShadow = true;

var light2 = new THREE.PointLight(0xFFFFFF, 0.75, 250); // (color; intensity; distance; decay)
light1.position.set(-20, 15, 5 );
//light2.castShadow = true;

var dirLight1 = new THREE.DirectionalLight(0xffffff, 0.75); // (color; intensity)
dirLight1.position.set(-1, 50, 5);
//dirLight1.castShadow = true;
dirLight1.shadow.mapSize.width = 2048; dirLight1.shadow.mapSize.height = 2048;
dirLight1.shadow.camera.left = -70; dirLight1.shadow.camera.right = 70;
dirLight1.shadow.camera.top = 70; dirLight1.shadow.camera.bottom = -70;

var sunlight = new THREE.AmbientLight(0xfff2cc, 0.25); // (color; intensity)
sunlight.position.set ( 1, 50, -5);
//sunlight.castShadow = true;

var lightTorch = new THREE.PointLight(0xffffff, 0.0, 5); // (color; intensity; distance; decay)

// -------------------------
// **** WORLD OBJs

// ** Ground
var sides=40; var tiers=40; var worldRadius = 100.0;
var worldGeometry = new THREE.DodecahedronGeometry( worldRadius, sides, tiers);
var worldBaseMat = new THREE.MeshStandardMaterial( { color: "#2b5329" ,flatShading:THREE.FlatShading} )
var worldMaterial = new THREE.MeshStandardMaterial( { 
    color: "#66ae65",
    map: world_diff,
    normalMap: world_norm,
    roughnessMap: world_roug,
    flatShading:THREE.FlatShading,
} )

rollingGroundWorld = new THREE.Mesh( worldGeometry, worldMaterial );
rollingGroundWorld.position.y = -101; rollingGroundWorld.position.z = 0;
rollingGroundWorld.rotation.x = Math.PI/2;
rollingGroundWorld.receiveShadow = true;

// ** Boundaries
var cyl_fence_geometry = new THREE.CylinderGeometry( 103, 103, 2, 54);
var cyl_fence_base_mat = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
var cyl_fence_material = new THREE.MeshStandardMaterial( { 
    map: fence_diff,
    normalMap: fence_norm,
    roughnessMap: fence_roug,
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
tuft1 = new THREE.Mesh(tuft1_geo, new THREE.MeshStandardMaterial({ color:'#8d7d7a', flatShading:true, }))
const tuft2_geo = new THREE.SphereGeometry(1.5,7,8); tuft2_geo.translate(2,0,0); 
tuft2 = new THREE.Mesh(tuft2_geo, new THREE.MeshStandardMaterial({ color:'#d8bcb6', flatShading:true, }))
const tuft3_geo = new THREE.SphereGeometry(2.0,7,8); tuft3_geo.translate(0,0,0);
tuft3 = new THREE.Mesh(tuft3_geo, new THREE.MeshStandardMaterial({ color:'#b69b96', flatShading:true, }))
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

var trunk_geometry = new THREE.CylinderGeometry( 0.65, 0.65, 5, 10 );
var trunk_material = new THREE.MeshStandardMaterial({ 
    color: "#8b522a", 
    map: trunk_diff,
    normalMap: trunk_norm,
    roughnessMap: trunk_roug,
});
var trunk_mesh = new THREE.Mesh(trunk_geometry, trunk_material);
trunk_mesh.castShadow = true; trunk_mesh.receiveShadow = true;
trunk_mesh.position.y = 0;
Tree.add(trunk_mesh);

var frond_geometry = new THREE.CylinderGeometry( 0, 2.0, 2.5, 6 );
var frond_material = new THREE.MeshStandardMaterial({ 
    color: "#2b5329",
    normalMap: fence_norm,
    roughnessMap: fence_roug,
});
var frond_mesh = new THREE.Mesh(frond_geometry, frond_material);
frond_mesh.castShadow = true; frond_mesh.receiveShadow = true;
frond_mesh.position.y = 2.5; frond_mesh.rotation.y=-Math.PI/3;
Tree.add(frond_mesh);

var pike_geometry = new THREE.CylinderGeometry( 0, 1.5, 2.0, 5 );
var pike_material = new THREE.MeshStandardMaterial({ 
    color: "#2b5329", 
    normalMap: fence_norm,
    roughnessMap: fence_roug,
});
var pike_mesh = new THREE.Mesh(pike_geometry, frond_material);
pike_mesh.castShadow = true; pike_mesh.receiveShadow = true;
pike_mesh.position.y = 3.5; pike_mesh.rotation.y=Math.PI/3;
Tree.add(pike_mesh);



// **** OBJECTS
var collidableMeshList = new Array();
  
// ----------
// COLUMNS
var wall_geometry = new THREE.BoxGeometry(0.0, 2.5, 0.0);
var wall_material = new THREE.MeshStandardMaterial( {color: "#A020F0"} );

// column mesh
var wall_column = new THREE.Mesh( wall_geometry, wall_material);
wall_geometry.visible=false;
wall_column.castShadow = false; wall_column.receiveShadow = false;
//wall_column.add(Tree);

var wall_column_2 = wall_column.clone();
    
// ----------
// LOW BLOCKS
var block_geometry = new THREE.IcosahedronGeometry(1.1, 0);
var block_base_geometry = new THREE.BoxGeometry(1.0, 2.0, 1.0);
var block_material = new THREE.MeshStandardMaterial( {
    color: "#8b522a",
    map: wall_block_diff,
    normalMap: wall_block_norm,
    roughnessMap: wall_block_roug,
} );

// low block mesh
    var wall_block = new THREE.Mesh( block_geometry, block_material );
    wall_block.position.y  = 0.5; wall_block.rotation.y  = Math.PI/4;
    wall_block.castShadow = true; wall_block.receiveShadow = true;

// ** Loaders **

const gltfLoader = new THREE.GLTFLoader();
const tree0_url = '../assets/scene/models/tree0.glb';
const tree1_url = '../assets/scene/models/tree1.glb';
const tree2_url = '../assets/scene/models/tree2.glb';
const tree3_url = '../assets/scene/models/tree3.glb';
const tree4_url = '../assets/scene/models/tree4.glb';

var glb_LoadModel = function (obj, _ulr){   
    gltfLoader.load(_ulr, (glb) => {
    model = glb.scene;
    model.position.y = -1.1; model.rotation.y = 0;
	//console.log(model.position)
    model.castShadow = true; model.receiveShadow = true;
    
    obj.add(model);
    });
}

// ================================================================
// ** FUNCTIONS **

var init_settings = function(){

    glb_LoadModel(wall_1, tree2_url);
    glb_LoadModel(wall_2, tree1_url);
    glb_LoadModel(wall_3, tree3_url);
    glb_LoadModel(wall_6, tree4_url);
        
}

var levelBG_animations = function(){

	slide_animations(BackGround_Cloud_1, 1, 70, BackGround_Cloud_1); 
	slide_animations(BackGround_Cloud_2,-1, 70, BackGround_Cloud_1);
	slide_animations(BackGround_Cloud_3,-1, 70, BackGround_Cloud_1);

}

var bg_slide_factor = 0.01;
var slide_animations = function(obj, dir, limit, objRef){
	if (objRef.position.x > limit) obj.position.x = -obj.position.x;
	obj.position.x += dir * bg_slide_factor;
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