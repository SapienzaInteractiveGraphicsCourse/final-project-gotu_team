// -------------
//   LEVEL 2
// -------------


//------------
//  * Level base variables

var BackgroundColor = 0x16192b;
var BackGround_Img  = '../assets/scene/textures/Level2_canvas.png';

var SPEED = 1.0;
var obsDistance = 2.0;
var collisionDistance = 1.5;

//------------
//  * Textures
const txloader = new THREE.TextureLoader();

const bg_Img = txloader.load(BackGround_Img);

const world_diff = txloader.load("../assets/scene/textures/level2/defense_wall_diff_1k.jpg");
const world_norm = txloader.load("../assets/scene/textures/level2/defense_wall_nor_gl_1k.jpg");
const world_roug = txloader.load("../assets/scene/textures/level2/defense_wall_rough_1k.jpg");
world_diff.wrapS = THREE.RepeatWrapping; world_diff.wrapT = THREE.RepeatWrapping; world_diff.repeat.set( 8, 8 );

const fence_diff = txloader.load("../assets/scene/textures/level2/castle_wall_varriation_diff_1k.jpg");
const fence_norm = txloader.load("../assets/scene/textures/level2/castle_wall_varriation_nor_gl_1k.jpg");
const fence_roug = txloader.load("../assets/scene/textures/level2/castle_wall_varriation_rough_1k.jpg");
fence_diff.wrapS = THREE.RepeatWrapping; fence_diff.wrapT = THREE.RepeatWrapping; fence_diff.repeat.set( 16, 16 );
fence_norm.wrapS = THREE.RepeatWrapping; fence_norm.wrapT = THREE.RepeatWrapping; fence_norm.repeat.set( 16, 16 );
fence_roug.wrapS = THREE.RepeatWrapping; fence_roug.wrapT = THREE.RepeatWrapping; fence_roug.repeat.set( 16, 16 );

const wall_block_diff = txloader.load("../assets/scene/textures/level2/green_metal_rust_diff_1k.jpg");
const wall_block_norm = txloader.load("../assets/scene/textures/level2/green_metal_rust_nor_gl_1k.jpg");
const wall_block_roug = txloader.load("../assets/scene/textures/level2/green_metal_rust_rough_1k.jpg");
wall_block_diff.wrapS = THREE.RepeatWrapping; wall_block_diff.wrapT = THREE.RepeatWrapping; wall_block_diff.repeat.set( 16, 16 );

const trunk_diff = txloader.load("../assets/scene/textures/level2/defense_wall_diff_1k.jpg");
const trunk_norm = txloader.load("../assets/scene/textures/level2/marble_5_norm.jpg");
const trunk_roug = txloader.load("../assets/scene/textures/level2/marble_5_rough.jpg");




//------------
//  * Lights 


var light1 = new THREE.PointLight(0xe45233, 0.85, 250); // (color; intensity; distance; decay)
light1.position.set( 0, 10, -5 );
light1.castShadow = true;

var light2 = new THREE.PointLight(0xffd966, 0.85, 250); // (color; intensity; distance; decay)
light2.position.set(-20, 10, -5 );
//light2.castShadow = true;

var dirLight1 = new THREE.DirectionalLight(0xffffff, 0.5); // (color; intensity)
dirLight1.position.set(0, 50, 5);
dirLight1.castShadow = true;
dirLight1.shadow.mapSize.width = 2048; dirLight1.shadow.mapSize.height = 2048;
dirLight1.shadow.camera.left = -70; dirLight1.shadow.camera.right = 70;
dirLight1.shadow.camera.top = 70; dirLight1.shadow.camera.bottom = -70;

var sunlight = new THREE.AmbientLight(0xffffff, 0.25); // (color; intensity)
sunlight.position.set ( 1, 50, -5);
//sunlight.castShadow = true;

var lightTorch = new THREE.PointLight(0xffffff, 0.0, 5); // (color; intensity; distance; decay)
lightTorch.position.set(0, 10, 5 );

// -------------------------
// **** WORLD OBJs

// ** Ground
    var sides=40; var tiers=40; var worldRadius = 100.0;
    var worldGeometry = new THREE.DodecahedronGeometry( worldRadius, sides, tiers);
    var worldBaseMat = new THREE.MeshStandardMaterial( { color: "#34353a" ,flatShading:THREE.FlatShading} )
    var worldMaterial = new THREE.MeshStandardMaterial( { 
        color: "#34353a",
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
    var cyl_fence_geometry = new THREE.CylinderGeometry( 105, 105, 2, 54);
    var cyl_fence_base_mat = new THREE.MeshStandardMaterial( { color: 0xffff00 } );
    var cyl_fence_material = new THREE.MeshStandardMaterial( { 
        color: 0x3c3d3e,
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
    fenceL.position.y = -101; fenceL.position.x = -5.0;
    fenceL.rotation.z = Math.PI/2; // 'Y' if Torus , 'Z' if Cylinder
    fenceL.castShadow = true; fenceL.receiveShadow = true;

    var fenceR = new THREE.Mesh( cyl_fence_geometry, cyl_fence_material );
    fenceR.position.y = -101; fenceR.position.x = +5.0;
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
    tuft2 = new THREE.Mesh(tuft2_geo, new THREE.MeshStandardMaterial({ color:'#262a30', flatShading:true, }))
    const tuft3_geo = new THREE.SphereGeometry(2.0,7,8); tuft3_geo.translate(0,0,0);
    tuft3 = new THREE.Mesh(tuft3_geo, new THREE.MeshStandardMaterial({ color:'#1e2023', flatShading:true, }))
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
    BackGround_Cloud_1.position.x = -25.0; BackGround_Cloud_1.position.y = 17.0; BackGround_Cloud_1.position.z = -30.0;
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

    var trunk_geometry = new THREE.CylinderGeometry( 0.45, 0.45, 5, 10 );
    var trunk_material = new THREE.MeshStandardMaterial({ 
        color: "#161616", 
        //map: trunk_diff,
        normalMap: trunk_norm,
        roughnessMap: trunk_roug,
    });

    var trunk_mesh = new THREE.Mesh(trunk_geometry, trunk_material);
    trunk_mesh.castShadow = true; trunk_mesh.receiveShadow = true;
    trunk_mesh.position.y = 0;
    Tree.add(trunk_mesh);

    var frond_geometry = new THREE.TetrahedronGeometry(radius=1.0);
    frond_geometry = new THREE.BoxGeometry(1.25, 0.05, 1.25);
    var frond_material = new THREE.MeshStandardMaterial( {
        color: "#999999",
        map: wall_block_diff,
        normalMap: wall_block_norm,
        roughnessMap: wall_block_roug,
    } );

    //var pike_geometry = new THREE.BoxGeometry(1.75, 0.15, 1.25);
    var pike_geometry = new THREE.OctahedronGeometry(1.0);
    var pike_material = new THREE.MeshStandardMaterial({ 
        color: "#5b5b5b", 
        normalMap: wall_block_norm,
        roughnessMap: wall_block_roug,
    });
    var pike_mesh_1 = new THREE.Mesh(pike_geometry, pike_material);
    pike_mesh_1.scale.set(1.0, 0.35, 0.4)
    pike_mesh_1.castShadow = true; pike_mesh_1.receiveShadow = true;
    pike_mesh_1.position.y = 0.0; pike_mesh_1.rotation.y=Math.PI/3;
    Tree.add(pike_mesh_1);

    var pike_mesh_2 = new THREE.Mesh(pike_geometry, pike_material);
    pike_mesh_2.scale.set(1.2, 0.35, 0.4)
    pike_mesh_2.castShadow = true; pike_mesh_2.receiveShadow = true;
    pike_mesh_2.position.y = 0.75; pike_mesh_2.rotation.y=Math.PI;
    Tree.add(pike_mesh_2);

    var pike_mesh_3 = new THREE.Mesh(pike_geometry, pike_material);
    pike_mesh_3.scale.set(1.5, 0.35, 0.4)
    pike_mesh_3.castShadow = true; pike_mesh_3.receiveShadow = true;
    pike_mesh_3.position.y = 1.5; pike_mesh_3.rotation.y=Math.PI/2;
    Tree.add(pike_mesh_3);

    var top_geometry = new THREE.IcosahedronGeometry(0.1, 0);
    var pike_mesh_4 = new THREE.Mesh(top_geometry, frond_material);
    pike_mesh_4.castShadow = true; pike_mesh_4.receiveShadow = true;
    pike_mesh_4.position.y = 2.65; pike_mesh_4.rotation.y=Math.PI/6;
    //Tree.add(pike_mesh_4);


// **** OBJECTS
var collidableMeshList = new Array();
  
// ----------
// COLUMNS
    var wall_geometry = new THREE.BoxGeometry(0.1, 2.5, 0.1);
    var wall_material = new THREE.MeshStandardMaterial( {color: "#A020F0"} );

    // column mesh
    var wall_column = new THREE.Mesh( wall_geometry, wall_material);
    wall_geometry.visible=false;
    wall_column.castShadow = false; wall_column.receiveShadow = false;
    wall_column.add(Tree);

    var wall_column_2 = wall_column.clone();
    
// ----------
// LOW BLOCKS
    var block_geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.25, 12);
    var block_base_geometry = new THREE.BoxGeometry(1.0, 2.0, 1.0);
    var block_material = new THREE.MeshStandardMaterial( {
        color: "#5b5b5b", 
        normalMap: wall_block_norm,
        roughnessMap: wall_block_roug,
    } );

    var saw_center_geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 24);
    var saw_center_material = new THREE.MeshStandardMaterial( {
        color: "#161616",
        normalMap: wall_block_norm,
        roughnessMap: wall_block_roug,
    } ); 
    saw_center = new THREE.Mesh( saw_center_geometry, saw_center_material );
    saw_center.position.y  = 0.0; saw_center.position.x  = 0.0;

// low block mesh
    var wall_block = new THREE.Mesh( block_geometry, block_material );
    wall_block.position.y  = 0.3; wall_block.rotation.x = Math.PI/2;
    wall_block.castShadow = true; wall_block.receiveShadow = true;

    wall_block.add(saw_center);


// ** Loaders **

const gltfLoader = new THREE.GLTFLoader();
const warrior_url = '../assets/scene/models/warrior.glb';


var glb_LoadModel = function (obj, _ulr){   
    gltfLoader.load(_ulr, (glb) => {
    model = glb.scene;
    model.position.y = 2.5
    model.rotation.y = Math.PI/12
	//console.log(model.position)
    model.castShadow = true; model.receiveShadow = true;
    
    obj.add(model);
    });
}


// ================================================================
// ** FUNCTIONS **

var init_settings = function(){

    glb_LoadModel(wall_1, warrior_url);
    glb_LoadModel(wall_2, warrior_url);
    glb_LoadModel(wall_3, warrior_url);
    glb_LoadModel(wall_6, warrior_url);
        
}

var levelBG_animations = function(){

    light_animations(light1, 1, 1);
    light_animations(light2, 1, 1);

	slide_animations(BackGround_Cloud_1, 1, 70, BackGround_Cloud_1); 
	slide_animations(BackGround_Cloud_2,-1, 70, BackGround_Cloud_1);
	slide_animations(BackGround_Cloud_3,-1, 70, BackGround_Cloud_1);

    block1_animations(wall_4); block2_animations(wall_4);
    block1_animations(wall_5); block2_animations(wall_5);

    pike_animation(wall_1); pike_animation(wall_2); 
    pike_animation(wall_3); pike_animation(wall_6); 
        
}

var bg_slide_factor = 0.01;
var slide_animations = function(obj, dir, limit, objRef){
	if (objRef.position.x > limit) obj.position.x = -obj.position.x;
	obj.position.x += dir * bg_slide_factor * speedUpBrowser;
}

var flickering_factor = 0.005;
var light_animations = function(obj, dir, limit){
	if (obj.intensity > limit) flickering_factor = -flickering_factor;
	obj.intensity += dir * flickering_factor * speedUpBrowser;
}

var block1_animations = function(obj){
	obj.position.x += 0.01 * speedUpBrowser;
}

var block2_animations = function(obj){
	obj.rotation.y -= 0.02 * speedUpBrowser;
}

var pike_animation = function(obj){
    obj.children[0].children[1].rotation.y += 0.02 * speedUpBrowser;
    obj.children[0].children[2].rotation.y -= 0.02 * speedUpBrowser;
    obj.children[0].children[3].rotation.y += 0.02 * speedUpBrowser;
}


// ================================================================
var MODELS = {

    BackgroundColor,
    SPEED, obsDistance, collisionDistance,

    light1, light2,
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