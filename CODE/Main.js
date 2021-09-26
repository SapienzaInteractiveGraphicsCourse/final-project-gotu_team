// -------------
//   MAIN file
// for the GOTU browser game
// -------------


var scene = new THREE.Scene();

var canvas_width  = 1080;
var canvas_height = 720;

var speedUpBrowser = 1;
function detectBrowser() {
	if (window.navigator.userAgent.indexOf("Edge") > -1){ 
		speedUpBrowser = 1.0;
		return "Edge";
	}
	if (window.navigator.userAgent.indexOf("Edg") > -1){ 
		speedUpBrowser = 1.0;
		return "Edge";
	}
	if(navigator.userAgent.indexOf("Chrome") != -1 ) {
		speedUpBrowser = 2.5;
        return 'Chrome';
    } else if(navigator.userAgent.indexOf("Firefox") != -1 ){
		speedUpBrowser = 1.0;
        return 'Firefox';
    } else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
        speedUpBrowser = 1.0;
		return 'IE'; // not tested
    } else {
		speedUpBrowser = 1.0;
        return 'Unknown';
    }
} 

var browser = detectBrowser();
console.log(browser);

//--------------------------
//  * Scene basic elements 

	var renderer = new THREE.WebGLRenderer( {canvas: gl_canvas} );
	renderer.setClearColor(BackgroundColor);
	renderer.setSize(canvas_width,canvas_height);

	scene.background = bg_Img;	// canvas background image

	var camera1 = new THREE.PerspectiveCamera(75, canvas_width/canvas_height, 0.1, 1000);
	var fov = camera1.fov, zoom = 1.0;
    camera1.lookAt( new THREE.Vector3(0, 0, 0) );
    camera1.position.x = 3;
	camera1.position.y = 7;
	camera1.position.z = 12;

//------------
//  * Lights 

	renderer.shadowMap.enabled = true; // to enable shadows
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	scene.add(light1); scene.add(light2);
	//scene.add(dirLight1);

	scene.add(sunlight);
	scene.add(lightTorch);

//----------
//  *** Meshes ***

	// ** Ground
    groundCenter = rollingGroundWorld.position;
    scene.add(rollingGroundWorld);
	
	// ** Boundary
	scene.add( fenceL );

	scene.add( fenceR );

	// ** Background Scenary
	scene.add(BackGround_Cloud_1); scene.add(BackGround_Cloud_2); scene.add(BackGround_Cloud_3);
	
	// --- HERO ---
	var hero;

	// ** Hero_box
	var hero_geometry = new THREE.BoxGeometry(1.5, 2, 1.5);
	var hero_material = new THREE.MeshLambertMaterial( {color: "#ffcc00"} );
	var hero_box = new THREE.Mesh(hero_geometry, hero_material);
    hero_box.position.x  = 0.0; hero_box.position.y  = 0.0; hero_box.position.z  = 0.0;
	hero_box.visible = false;
	
	scene.add(hero_box);

	// ** Rolling rock
    var rockRadius = 1.0, rockBaseY = 0;
    var sphereGeometry = new THREE.DodecahedronGeometry( rockRadius, 1);
    var sphereMaterial = new THREE.MeshStandardMaterial( { color: "#222222" ,flatShading:THREE.FlatShading} )
    rockSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    rockSphere.castShadow = true; rockSphere.receiveShadow = true;
    scene.add(rockSphere); 
    rockSphere.visible = true;

    hero = rockSphere;


	// ** Objects

    // wall 1
	wall_1 = wall_column.clone();
    scene.add(wall_1);
    wall_1.position.x  = 2.0; wall_1.position.y += 0.0;
    rotateOnPivot(wall_1, groundCenter, (new THREE.Vector3(1,0,0)), Math.PI/2);
	collidableMeshList.push(wall_1);

	// wall 2
	wall_2 = wall_column_2.clone();
	scene.add(wall_2);
	wall_2.position.x  = -2.0; wall_2.position.y += -202.0;
	wall_2.rotation.x += Math.PI;
    rotateOnPivot(wall_2, groundCenter, (new THREE.Vector3(1,0,0)), 0);
	collidableMeshList.push(wall_2);

    // wall 3
	wall_3 = wall_column_2.clone();
    scene.add(wall_3);
    wall_3.position.x  = -2.0; wall_3.position.y += 0.0;
    rotateOnPivot(wall_3, groundCenter, (new THREE.Vector3(1,0,0)), -0.2);
	collidableMeshList.push(wall_3);

    // wall 4
	wall_4 = wall_block.clone();
    scene.add(wall_4);
    wall_4.position.x  = 2.0; wall_4.position.y += -202.0;
    rotateOnPivot(wall_4, groundCenter, (new THREE.Vector3(1,0,0)), -0.1);
	collidableMeshList.push(wall_4);
	
    // wall 5
	wall_5 = wall_block.clone();
    scene.add(wall_5);
    wall_5.position.x  = -2.0; wall_5.position.y += -1.0;
    rotateOnPivot(wall_5, groundCenter, (new THREE.Vector3(1,0,0)), -0.1);
	collidableMeshList.push(wall_5);

	// wall 6
	wall_6 = wall_column.clone();
    wall_6.position.x  = 2.0; wall_6.position.y += 0.0;
    rotateOnPivot(wall_6, groundCenter, (new THREE.Vector3(1,0,0)), 2);
    scene.add(wall_6); collidableMeshList.push(wall_6);

// -----------------------------
// **** FLAGs and Game VARs **** 

	var clock = new THREE.Clock(true)

    var rollingGroundSpeed = SPEED * 0.001 * speedUpBrowser; 
	var rockRollingSpeed= SPEED * 0.05 * speedUpBrowser;
	var thetaAngle = 0.001 * SPEED  * speedUpBrowser;
	var rotAxis = new THREE.Vector3(1,0,0);
	bg_slide_factor = bg_slide_factor * speedUpBrowser;
	var zoom_factor = 0.02 * speedUpBrowser;

    var collision = true, collisionTime = 200;
    var jumping=false, jumpHeight = 1.5;

	var pause = true;
    var gameover = false;
	var hero_lives = 3;
	var points  = 0;
	var record  = 0;
    
	var level = document.getElementById("level_label").innerHTML;
	console.log(level);
	// switch (level){
	// 	case "LEVEL 2": {
	// 		scene.add(wall_5); collidableMeshList.push(wall_6);
	// 	}
	// 	case "LEVEL 3": {
	// 		scene.add(wall_6); collidableMeshList.push(wall_6);			
	// 	}
	// }

// -------------------
// **** FUNCTIONS ****

    var pauseControl = function(){
        if (gameover) {
			RESTART();
		}
		else {
			pause = !pause;
			if (pause)	document.getElementById("paused").style.display='block';
			else {
				document.getElementById("paused").style.display='none';
				document.getElementById("starting").style.display='none';
			}
		}
    }

	var gameOverControl = function(){
        pause = true;
        gameover = true;
		if (record<points) record = points;
        document.getElementById("game_over").style.display='block';
    }

    var RESTART = function(){

		hero_box.rotation.x = 0;
		hero_box.position.x = 0; hero_box.position.y = 0;
		hero.position.x = 0; hero.position.y = 0;
		currentLane = 0.0;
		
		clock.start();
		hero_lives = 3; points=0; 
		collisionTime = 200;
		jumping=false,
        gameover = false; pause = false;
        document.getElementById("paused").style.display='none';
        document.getElementById("game_over").style.display='none';
		document.getElementById("starting").style.display='none';
    }

	var soundControls=function(audio){
		
		var snd  = document.getElementById("play_sound");
		var src  = document.createElement("source");
		src.type = "audio/mp3";
		snd.appendChild(src);
		switch (audio){
			case "hit" : src.src = "../assets/Audio/default.wav";
		}
		snd.play();
	}

// ** Obstacle generation ** 

var obstacleRotation = function(){
    for (var obs_index=0; obs_index < collidableMeshList.length; obs_index++){
        rotateOnPivot(collidableMeshList[obs_index], groundCenter, rotAxis, thetaAngle);
        popObstacles(collidableMeshList[obs_index]);
    }
}

var popObstacles = function(obj){
	obj.visible = true;
	if (obj.position.z>1) obj.visible = false;
	if (obj.position.y < -10){
        rotateOnPivot(obj, groundCenter, rotAxis, -1);
		generateNewObstacle(obj);
    }
}

var generateNewObstacle = function(obj){
	randomX = THREE.MathUtils.randInt(-obsDistance , obsDistance)
	if (obsDistance==1) randomX=randomX*2;
	// console.log(randomX)

	obj.position.x = randomX;
}


// ** Collision detection **

var checkCollisions = function(obj){
	if (collisionTime > 0){
		hero.visible = true;
		if (collisionTime%2==1) hero.visible = false;
		collisionTime -= 1*speedUpBrowser;
		// console.log(collisionTime);
	}
    else { for ( var obs_index=0; obs_index < collidableMeshList.length; obs_index++ ){
		hero.visible = true;
		collisionItem = collidableMeshList[obs_index];
        if(collisionItem.position.distanceTo(obj.position) <= collisionDistance){
			console.log(" HIT HIT HIT ");
			hero_lives--;
			if (hero_lives < 1) gameOverControl();
			console.log(hero_lives);
			soundControls("hit");
			collisionTime = 250;
        }
    }}
}
//---------------------
// **** ANIMATIONS ****
var animations = function(){

    hero_motion(hero_box);

    ground_animations();
	levelBG_animations();
	
    obstacleRotation();

	points = Math.floor(clock.getElapsedTime())
	document.getElementById("lives").textContent  = hero_lives;
	document.getElementById("points").textContent = points;
	document.getElementById("record").textContent = record;
}


// ** Anime_Functions **


var hero_motion = function(obj){
    
	deltaClock = clock.getDelta();
    obj.position.x=THREE.Math.lerp(hero_box.position.x, currentLane, 2*deltaClock);
	
	if (jumping){
		if (obj.position.y > jumpHeight) bounceValue=-bounceValue;
		obj.position.y += bounceValue;
		//console.log(obj.position.y);
		if (obj.position.y<0){
			obj.position.y=0;
			jumping = false; bounceValue=0;
		}
	} rockSpinning();
}

var hero_animations = function(){
    
}

var rockSpinning = function(){   // animation for Rock rotation
    
    rockSphere.rotation.x -= rockRollingSpeed;

	if (jumping){
		rockSphere.position.y += bounceValue;
	}
    rockSphere.position.x=THREE.Math.lerp(rockSphere.position.x, currentLane, 2*deltaClock);
}


function rotateOnPivot(obj, point, axis, theta){
    
    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT

    //console.log(obj.position);
}

var zoom_animations = function(){
	
	camera1.position.x -= zoom_factor; 
	camera1.position.y -= zoom_factor*1.5; 
	camera1.position.z -= zoom_factor*2;

	if ( camera1.position.x <= 0) zoom_factor = 0;
	// console.log(camera1.zoom); 
	// console.log(camera1.position);
}

var ground_animations = function(){
    rollingGroundWorld.rotation.x += rollingGroundSpeed;
	fenceL.rotation.x += rollingGroundSpeed;
	fenceR.rotation.x += rollingGroundSpeed;
}

//---------------------
// **** CONTROLS ****

var leftLane = -2, middleLane = 0, rightLane = 2;
var currentLane = middleLane;


function movement_controls(keyEvent){
    if(jumping) return;
    var validMove=true;
    if ( keyEvent == 'ArrowLeft' || keyEvent == 'KeyA' ) { // LEFT - arrow_left / A
        if(currentLane==middleLane){
            currentLane=leftLane;
        }else if(currentLane==rightLane){
            currentLane=middleLane;
        }else{
            validMove=false;    
        }
    }

    else if ( keyEvent == 'ArrowRight' || keyEvent == 'KeyD' ) { // RIGHT - arrow_right / D
        if(currentLane==middleLane){
            currentLane=rightLane;
        }else if(currentLane==leftLane){
            currentLane=middleLane;
        }else{
            validMove=false;    
        }
    } 

    else {
        if ( keyEvent == 'ArrowUp' || keyEvent == 'KeyW' ){ // JUMP - arrow_up / W
        	if (!jumping) bounceValue=0.03 * speedUpBrowser;
			console.log("SLIDE COMMAND");
        	jumping=true;
        }
        validMove=false;
    }

}

// =============================================================================
// =============================================================================
// **** INIT **** 
	window.onload = function init(){
		
		//pauseControl();
		document.getElementById("pause_B").onclick = function(){ pauseControl(); };   // Pause button
		
        document.addEventListener('keydown', (event) => {  // keyboard input controller
            var code = event.code;
            console.log(code);

            switch (code){
                case 'Escape': pauseControl(); break;
                case 'KeyP':   pauseControl(); break;

                case 'KeyR': RESTART(); break;

                
            default : movement_controls(code);
            }
        }, false);
        
		init_settings();

		render();
	}


// **** RENDER **** 
	var render = function(){
		requestAnimationFrame(render);

		// ZOOM
		zoom_animations();
		camera1.zoom = zoom;
		camera1.updateProjectionMatrix();

		if (!pause){   // Pause controller
			checkCollisions(hero_box);
			animations();
		}

		renderer.render(scene, camera1);
	}
