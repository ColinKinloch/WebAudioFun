/*global define*/
'use strict';
define(['Game', 'THREE', 'CANNON', 'Button', 'CamTracker', 'Note', 'GoodSeq', 'PolySynth', 'furEliseGood', 'glTF/threejs/glTFLoader'],
function(Game ,  THREE ,  CANNON ,  Button ,  CamTracker ,  Note ,  GoodSeq ,  PolySynth ,  furElise){
  
  var pads;
  
  var loader = new THREE.glTFLoader;
  loader.useBufferGeometry = false;
  
  var sphereBody, sphereShape, sphereObj;
  var audio;
  var groundBody, groundShape, groundMesh;
  var lightAmb, lightPoint;
  var camtrack;
  
  var inst;
  var msynth;
  
  var seq;
  
  var midi;
  
  var but;
  
  var ThisGame = function(canvas)
  {
    var that = this;
    
    Game.prototype.constructor.call(this, canvas);
    
    this.renderer.shadowMapEnabled = true;
    
    sphereBody = new CANNON.Body({
      mass: 5,
      linearDamping: 0.9
    });
    sphereShape = new CANNON.Sphere(1);
    sphereBody.addShape(sphereShape);
    sphereBody.position.set(0,0,10);
    //sphereBody.angularVelocity.set(0,10,0);
    this.world.add(sphereBody);
    
    sphereObj = new THREE.Object3D();
    this.scene.add(sphereObj);
    var ball;
    loader.load('/res/models/Ball2.gltf', function(data){
      var scale = 0.001;
      ball = data.scene;
      //ball.scale.set(scale, scale, scale);
      //monster.rotation.x = -0.5*Math.PI;
      //that.scene.add(ball);
      for(var i=0; i< data.animations.length; i++)
      {
        var anim = data.animations[i];
        anim.loop = true;
        anim.duration = 3;
        anim.play();
      }
      sphereObj.add(ball);
    
      sphereObj.castShadow = true;
      sphereObj.receiveShadow = true;
      groundMesh.castShadow = true;
      groundMesh.receiveShadow = true;
    });
    
    groundBody = new CANNON.Body({
      mass: 0
    });
    groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    this.world.add(groundBody);
    
    groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000),
      new THREE.MeshPhongMaterial({
        color: new THREE.Color(0x66ff66),
        ambient: new THREE.Color(0x010101),
        emissive: new THREE.Color(0x000000),
        specular: new THREE.Color(0x009900),
        shininess: 30,
        shading: THREE.FlatShading,
        vertexColors: THREE.FaceColors
      })
    );
    this.scene.add(groundMesh);
    
    lightAmb = new THREE.AmbientLight(new THREE.Color(0xffffff));
    this.scene.add(lightAmb);
    
    lightPoint = new THREE.PointLight(new THREE.Color(0xffffff), 1, 1000);
    lightPoint.position.set( 25, 50, 50 );
    this.scene.add(lightPoint);
    
    camtrack = new CamTracker(this.camera, sphereObj, 3, 0.01);
    
    audio = new THREE.Audio(this.listener);
    //audio.load('/res/audio/ele.wav');
    audio.setLoop(-1);
    sphereObj.add(audio);
    
    msynth = new PolySynth(this.listener.context);
    msynth.connect(audio.panner);
    seq = new GoodSeq(furElise);
    seq.speed = 0.4;
    
    inst = new PolySynth(this.listener.context, {
      voices: 16
    });
    inst.connect(audio.panner);
    
    var onMidi = function(e)
    {
      inst.update(e.data);
    };
    var onMidiConnect = function(e)
    {
      console.log('conn',e);
    };
    var onMidiDisconnect = function(e)
    {
      console.log('dis',e);
    };
    if(navigator.requestMIDIAccess)
    {
      navigator.requestMIDIAccess().then(function(r){
        midi = r;
        //paused = false;
        midi.onconnect = onMidiConnect;
        midi.ondisconnect = onMidiDisconnect;
        if (midi.inputs.length === 0)
        {
          console.error('no devices');
        }
        var inputs = midi.inputs.values();
        for(var input = inputs.next(); input && !input.done; input = inputs.next())
        {
          console.log(input.value.name);
          input.value.onmidimessage = onMidi;
        }
      },
      function(e){
        console.error('midi fail', e);
      });
    }
  };
  
  ThisGame.prototype = Object.create(Game.prototype);
  ThisGame.prototype.constructor = ThisGame;
  
  ThisGame.prototype.loop = function(t, d)
  {
    
    pads = navigator.getGamepads();
    
    Game.prototype.loop.call(this, t, d);
    
    var pad = pads[0];
    
    if(pad !== undefined)
    {
      var a1 = new THREE.Vector2().set(pad.axes[0], pad.axes[1]);
      var a2 = new THREE.Vector2().set(pad.axes[2], pad.axes[3]);
      
      if(!but)
      {
        but = new Button(pad.buttons[0]);
      }
      but.update();
      but.poll();
      
      var camSp = new THREE.Vector2(0.1,0.1);
      var rotScale = new THREE.Vector2(-0.01, -0.01);
      var run = 1;
      
      if(pad.buttons[2].pressed)
      {
        run = 10;
      }
      
      this.camera.translateX(camSp.x*a2.x);
      this.camera.translateY(camSp.y*a2.y);
      
      var angleV = new THREE.Vector2().copy(sphereObj.position);
      angleV.sub(new THREE.Vector2().copy(this.camera.position));
      var angle = THREE.Vector3.prototype.angleTo.call(angleV,new THREE.Vector2(1,0,0));
      if(angleV.y<0)
      {
        angle = -angle+2*Math.PI;
      }
      var move = new THREE.Vector3().copy(a1).setZ(0).applyAxisAngle(new THREE.Vector3(0,0,1), angle);
      var force = new CANNON.Vec3(run*move.y, run*move.x, 0);
      sphereBody.applyImpulse(force, sphereBody.position);
      sphereBody.angularVelocity.x += a1.x;
      sphereBody.angularVelocity.y += a1.y;
      
      
      if(but.justPressed())
      {
        sphereBody.velocity.set(0,0,10);
      }
      
      if(pad.buttons[3].pressed)
      {
        audio.gain.gain.value = !audio.gain.gain.value;
      }
      
      if(pad.buttons[9].pressed)
      {
        sphereBody.position.set(0,0,2);
        sphereBody.velocity.set(0,0,0);
        sphereBody.angularVelocity.set(0,0,0);
        sphereBody.quaternion.set(0,0,0,1);
      }
    }
    var notes = seq.update(d);
    for(var n in notes)
    {
      msynth.noteOn(notes[n].getMidi(), notes[n].mag*10);
    }
  };
  ThisGame.prototype.draw = function()
  {
    sphereObj.position.copy(sphereBody.position);
    sphereObj.quaternion.copy(sphereBody.quaternion);
    
    THREE.glTFAnimator.update();
    
    camtrack.update();
    
    Game.prototype.draw.call(this);
  };
  
  return ThisGame;
});
