// import * as THREE from '../../libs/three128/three.module.js';
// import  FBXLoader  from '../../libs/loader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
// import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from '../../libs/three128/GLTFLoader.js';

class NPCHandler{
    constructor( game ){
        this.game = game;
		this.loadingBar = this.game.loadingBar;
		this.load();
	}

	

    load(){
		this._mixers = [];
        const loader = new FBXLoader();
        let assetsPath = '../../assets/';
		// const loader = new GLTFLoader( ).setPath(`${assetsPath}/`);
        // let assetsPath = '../../assets/Mma Idle.fbx';
        this.loadingBar.visible = true;



		loader.setPath('../../assets/');
		loader.load('Mma Idle.fbx', (fbx) => {
			// fbx.scale.setScalar(0.001);
			const m = new THREE.AnimationMixer(fbx);
			fbx.scale.set(0.0065, 0.0065, 0.0065);
			fbx.position.set(1, 2, 1);

			fbx.traverse(c => {
				c.castShadow = true;
				
				if (c instanceof THREE.Mesh) {

					console.log(c.material.map)
					// apply texture
					// c.material.map = texture
					// c.material.needsUpdate = true;
				}
			});

			const params = {
				target: fbx,
				camera: this._camera,
			}

			const anim = new FBXLoader();
			anim.setPath('../../assets/');
			anim.load('idle.fbx', (anim) => {
				// const m = new THREE.AnimationMixer(fbx);
				this.game.mixer = m;
				this._mixers.push(m);
				// const idle = m.clipAction(anim.animations[0]);
				const idle = m.clipAction(anim.animations[0]);
				idle.play();
			});
			this.game.scene.add(fbx);
    });



		// loader.load(
		// 	// resource URL
		// 	'Mma Idle glt.gltf',
		// 	// called when the resource is loaded
		// 	gltf => {
		// 		gltf.scene.scale.set(0.0065,0.0065,0.0065);
		// 		// this.scene.add(gltf.scene);
		// 		// console.log(gltf)
		// 		this.game.scene.add(gltf.scene);
		// 		// this.factory = gltf.scene;
		// 		// this.fans = [];

		// 		// const mergeObjects = {elements2:[], elements5:[], terrain:[]};

		// 		// gltf.scene.traverse( child => {
		// 		// 	if(child.isMesh){
		// 		// 		if(child.name.includes('fan')){
		// 		// 			this.fans.push(child);
		// 		// 		}else if (child.material.name.includes('elements2')){
		// 		// 			mergeObjects.elements5.push(child);
		// 		// 			child.castShadow = true;
		// 		// 		}else if (child.material.name.includes('terrain')){
		// 		// 			mergeObjects.terrain.push(child);
		// 		// 			child.castShadow = true;
		// 		// 		}else if (child.material.name.includes('sand')){
		// 		// 			child.receiveShadow = true;
		// 		// 		}else if (child.material.name.includes('elements1')){
		// 		// 			child.castShadow = true;
		// 		// 			child.receiveShadow = true;

		// 		// 		}else if (child.material.name.includes('main')){
		// 		// 			child.castShadow = true;
		// 		// 		}
		// 		// 	}
		// 		// });

		// 		// for(let prop in mergeObjects){
		// 		// 	const array = mergeObjects[prop];
		// 		// 	let material;
		// 		// 	array.forEach( object => {
		// 		// 		if (material == undefined){
		// 		// 			material= object.material;
		// 		// 		}else{
		// 		// 			object.material = material;
		// 		// 		}
		// 		// 	})
		// 		// }

		// 		this.loadingBar.visible = false;

		// 		// this.renderer.setAnimationLoop(this.render.bind(this));
		// 	},
		// 	// called while loading is progressing
		// 	xhr => {

		// 		this.loadingBar.update('environment', xhr.loaded, xhr.total);
				
		// 	},
		// 	// called when loading has errors
		// 	err => {

		// 		console.error( err );

		// 	}
		// );
		
		// Load a FBX resource
		// loader.load(assetsPath, object => {
        //     mixer = new THREE.AnimationMixer(object);
        
        //     const action = mixer.clipAction(object);
        //     action.play();
        
        //     object.traverse(child => {
        //         if(childisMesh) {
        //             child.castShadow = true;
        //             child.receiveShadow = true;
        //         }
        //     })
        
        //     this.game.scene.add(object);
        // });


		// Load a gltf resource

	}
    
	initNPCs(gltf = this.gltf){
		this.waypoints = this.game.waypoints;
        
		const gltfs = [gltf];
			
		for(let i=0; i<3; i++) gltfs.push(this.cloneGLTF(gltf));

		this.npcs = [];
		
		gltfs.forEach(gltf => {
			const object = gltf.scene;

			object.traverse(function(child){
				if (child.isMesh){
					child.castShadow = true;
				}
			});

			const options = {
				object: object,
				speed: 0.8,
				animations: gltf.animations,
				waypoints: this.waypoints,
				app: this.game,
				showPath: false,
				zone: 'factory',
				name: 'swat-guy',
			};

			const npc = new NPC(options);

			npc.object.position.copy(this.randomWaypoint);
			npc.newPath(this.randomWaypoint);
			
			this.npcs.push(npc);
			
		});

		this.loadingBar.visible = !this.loadingBar.loaded;

		this.game.startRendering();
	}

	
    
    

    update(dt){
        
		if (this.game.mixer !== undefined ) this.game.mixer.update(dt);
		
		if (this.npcs) this.npcs.forEach( npc => npc.update(dt) );
    }
}

export { NPCHandler };