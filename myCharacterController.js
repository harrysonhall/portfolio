import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import loader from "css-loader";


		// NOTE: The function CALLS act in this context as the constructor sorta.


BasicCharacterControllerInput(); // Call the initialization function for 'Logging, Listening, and Updating' Keyboard Input

 function BasicCharacterControllerInput() { // Creating the initialization function for 'Logging, Listening, and Updating' Keyboard Input

	const keys = {		// Create an array of switches for the controlling keys (W,A,S,D,Space,Shift).
		forward: false,		// Bascially, this will tell you if a key is being pressed down or not by equaling to "true" if it IS being pressed down, and "false" if it is NOT being pressed down.
		backward: false,	// Everything is set to "false" by default.
		left: false,
		right: false,
		space: false,
		shift: false,
	};

	document.addEventListener('keydown', (keybeingpressed) => {	// Add a Listener to listen for keys being pressed down.
		onKeyDownFunc(keybeingpressed);	// Calling the 'onKeyDownFunc' Function and sending the key that is being pressed down, as a parameter.
	});

	document.addEventListener('keyup', (keybeingpressed) => {	// Add a Listener to listen for keys being lifted up.
		onKeyUpFunc(keybeingpressed);	// Calling the 'onKeyUpFunc' Function and sending the key that is being lifted up, as a parameter.
	});

	function onKeyDownFunc(keybeingpressed) {	// Creating the function to handle the key that is being pressed down.
												
		switch(keybeingpressed.code) {			// Basically, all this function does, is 'switch' one or multiple of the properties in the 'keys' array to "true", depeneding on which key is being pressed down.
			case 'KeyW':
				keys.forward = true;
				break;

			case 'KeyA':
				keys.left = true;
				break;

			case 'KeyS':
				keys.backward = true;
				break;

			case 'KeyD':
				keys.right = true;
				break;

			case 'Space':
				keys.space = true;
				break;
			
			case 'ShiftLeft':
				keys.shift = true;
				break;

		}

	};

	function onKeyUpFunc(keybeingpressed) {		// Creating the function to handle the key that is being lifted up.

		switch(keybeingpressed.code) {			// Basically, all this function does, is 'switch' one or multiple of the properties in the 'keys' array to "false", depeneding on which key is being lifted up.
			case 'KeyW':
				keys.forward = false;
				break;

			case 'KeyA':
				keys.left = false;
				break;

			case 'KeyS':
				keys.backward = false;
				break;

			case 'KeyD':
				keys.right = false;
				break;

			case 'Space':
				keys.space = false;
				break;
			
			case 'ShiftLeft':
				keys.shift = false;
				break;

		}

	};

}


BasicCharacterController(parameters);	// Call the initaliization function for 

function BasicCharacterController(cameraAndScene) { 

	let targetFBXModel; // Declare a variable for the FBX Character that is to be animated upon, with scope access to the entire 'BasicCharacterController' function.


	function loadModels() {
		
		const fbxLoader = new FBXLoader(); 	// Create the FBXLoader the character model that is to be animated upon.

		fbxLoader.load("polyman.fbx", (fbx) => {

			fbx.scale.setScalar(1);	// OPTIONAL: This basically can alter the 'scale' or size of the fbx model.

			targetFBXModel = fbx;	// Initialize the 'targetFBXModel' variable to be the loaded FBX Character Model. This is basically for Global Access to the 'BasicCharacterController' (parent) Function.

			cameraAndScene.scene.add(fbx); // This adds the FBX Character Model to the scene. The scene is being accessed through the 'cameraAndScene' Parameters and selecting the 'scene' property.

			const animationMixer = new THREE.AnimationMixer(fbx) // Create the 'AnimationMixer' for the Character Model so it can be animated.

			const loadingManger = new THREE.LoadingManager();

			loadingManger.onLoad(() => {
				
			})

			function onAnimationLoad(animationName, animationn) {	// This function takes two parameters. Basically, the first one is a STRING value that you create for the animation name, and the second the actual ANIMATION (or in other words the FBX Model without the skin).
				const animationClip = animationn	// Creates a variable that is equal to the 2nd parameter
				const animationAction = animationMixer.clipAction(animationClip)	// Creates a variable that is equal to the 1rst parameter

				const animations = {
					clip: animationClip,
					action: animationAction,
				}
			}

			fbxLoader.load('polyman-anime.fbx',(fbxAnimation) => {	// Loading in the 'idle' state FBX animation.
				onAnimationLoad('idle', fbxAnimation);	// Then once its loaded, send as a parameter to the 'onAnimationLoad' Function
			})

			fbxLoader.load('polyman-walk-anime.fbx',(fbxAnimation) => {

			})

		})		

	}

}