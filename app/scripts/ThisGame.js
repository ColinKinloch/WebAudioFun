/*global define*/
'use strict';
define(['game/Game', 'THREE', 'CANNON', 'game/Pad', 'game/Button', 'CamTracker', 'music/Note', 'music/GoodSeq', 'music/ShepardSeq', 'music/MonoSynth', 'music/PolySynth', 'furEliseGood', 'glTF/threejs/glTFLoader'],
function(Game ,  THREE ,  CANNON ,  Pad ,  Button ,  CamTracker ,  Note ,  GoodSeq ,  ShepardSeq ,  MonoSynth, PolySynth ,  furElise){
  
  
  var ThisGame = function(canvas)
  {
    
    let that = this;
    
    this.pads = navigator.getGamepads();
    
    this.loader = new THREE.glTFLoader();
    this.loader.useBufferGeometry = false;
    
    this.shepn = 4;
    this.shep = [];
    this.shepsynth = [];
    
    Game.prototype.constructor.call(this, canvas);
    
    var context = this.listener.context;
    
    this.renderer.shadowMapEnabled = true;
    
    this.sphereBody = new CANNON.Body({
      mass: 5,
      linearDamping: 0.9
    });
     this.sphereShape = new CANNON.Sphere(1);
    this.sphereBody.addShape(this.sphereShape);
    this.sphereBody.position.set(0,0,10);
    //this.sphereBody.angularVelocity.set(0,10,0);
    this.world.add(this.sphereBody);
    
    this.sphereObj = new THREE.Object3D();
    this.scene.add(this.sphereObj);
    var ball;
    this.loader.load('/res/models/Ball2.gltf', function(data){
      ball = data.scene;
      //ball.scale.set(scale, scale, scale);
      //monster.rotation.x = -0.5*Math.PI;
      //that.scene.add(ball);
      console.log(ball);
      for(var i=0; i< data.animations.length; i++)
      {
        var anim = data.animations[i];
        anim.loop = true;
        anim.duration = 3;
        anim.play();
      }
      that.sphereObj.add(ball);
    
      that.sphereObj.castShadow = true;
      that.sphereObj.receiveShadow = true;
       that.groundMesh.castShadow = true;
       that.groundMesh.receiveShadow = true;
    });
    
     this.groundBody = new CANNON.Body({
      mass: 0
    });
     this.groundShape = new CANNON.Plane();
     this.groundBody.addShape(this.groundShape);
    this.world.add(this.groundBody);
    
     this.groundMesh = new THREE.Mesh(
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
    this.scene.add(this.groundMesh);
    
     this.lightAmb = new THREE.AmbientLight(new THREE.Color(0xffffff));
    this.scene.add(this.lightAmb);
    
     this.lightPoint = new THREE.PointLight(new THREE.Color(0xffffff), 1, 1000);
     this.lightPoint.position.set( 25, 50, 50 );
    this.scene.add(this.lightPoint);
    
     this.camtrack = new CamTracker(this.camera, this.sphereObj, 3, 0.01);
    
     this.audio = new THREE.Audio(this.listener);
    ///this.audio.load('/res/audio/ele.ogg');
     this.audio.setLoop(-1);
    this.sphereObj.add(this.audio);
    
     this.msynth = new PolySynth(context);
     this.msynth.connect(this.audio.panner);
     this.seq = new GoodSeq(furElise);
     this.seq.speed = 0.4;
    
    this.shepseq = new ShepardSeq(2, 4);
    var gap = 1/(2*this.shepn);
    var ShepSynth = PolySynth;
    for(var i=0; i<this.shepn;++i)
    {
      this.shep[i] = new GoodSeq([
        [new Note('c2', gap*0), new Note('b5', 0)],
        [new Note('d2', gap*1), new Note('c2', 0)],
        [new Note('e2', gap*2), new Note('d2', 0)],
        [new Note('f#2', gap*3), new Note('e2', 0)],
        [new Note('g#2', gap*4), new Note('f#2', 0)],
        [new Note('a#2', gap*5), new Note('g#2', 0)],
        [new Note('b2', gap*6), new Note('a#2', 0)],
        [new Note('c3', gap*7), new Note('b2', 0)],
        [new Note('d3', 1), new Note('c3', 0)],
        [new Note('e3', 1), new Note('d3', 0)],
        [new Note('f#3', 1), new Note('e3', 0)],
        [new Note('g#3', 1), new Note('f#3', 0)],
        [new Note('a#3', 1), new Note('g#3', 0)],
        [new Note('b3', 1), new Note('a#3', 0)],
        [new Note('c4', 1), new Note('b3', 0)],
        [new Note('d4', 1), new Note('c4', 0)],
        [new Note('e4', 1), new Note('d4', 0)],
        [new Note('f#4', 1), new Note('e4', 0)],
        [new Note('g#4', 1), new Note('f#4', 0)],
        [new Note('a#4', 1), new Note('g#4', 0)],
        [new Note('b4', gap*7), new Note('a#4', 0)],
        [new Note('c5', gap*6), new Note('b4', 0)],
        [new Note('d5', gap*5), new Note('c5', 0)],
        [new Note('e5', gap*4), new Note('d5', 0)],
        [new Note('f#5', gap*3), new Note('e5', 0)],
        [new Note('g#5', gap*2), new Note('f#5', 0)],
        [new Note('a#5', gap*1), new Note('g#5', 0)],
        [new Note('b5', gap*0), new Note('a#5', 0), 'restart']
      ]);
      this.shep[i].t = 7*i;
      this.shep[i].speed = 0.2;
      
      this.shepsynth[i] = new ShepSynth(context);
      this.shepsynth[i].connect(this.audio.panner);
    }
    
    
     this.inst = new PolySynth(context, {
      voices: 16
    });
     this.inst.connect(this.audio.panner);
    
    var onMidi = function(e)
    {
       that.inst.update(e.data);
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
        that.midi = r;
        //paused = false;
        that.midi.onconnect = onMidiConnect;
        that.midi.ondisconnect = onMidiDisconnect;
        if (that.midi.inputs.length === 0)
        {
          console.error('no devices');
        }
        var inputs = that.midi.inputs.values();
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
    
    this.pads = navigator.getGamepads();
    
    
    Game.prototype.loop.call(this, t, d);
    
    var pad = this.pads[0];
    var gp;
    if(pad !== undefined)
    {
      if(!gp)
      {
        gp = new Pad(pad);
      }
      var a1 = gp.ls;
      var a2 = gp.rs;
      
      gp.update();
      gp.poll();
      
      var camSp = new THREE.Vector2(0.1,0.1);
      //var rotScale = new THREE.Vector2(-0.01, -0.01);
      var run = 1;
      
      if(gp.b.pressed())
      {
        run = 10;
      }
      
      this.camera.translateX(camSp.x*a2.x);
      this.camera.translateY(camSp.y*a2.y);
      
      var angleV = new THREE.Vector2().copy(this.sphereObj.position);
      angleV.sub(new THREE.Vector2().copy(this.camera.position));
      var angle = THREE.Vector3.prototype.angleTo.call(angleV,new THREE.Vector2(1,0,0));
      if(angleV.y<0)
      {
        angle = -angle+2*Math.PI;
      }
      var move = new THREE.Vector3().copy(a1).setZ(0).applyAxisAngle(new THREE.Vector3(0,0,1), angle);
      var force = new CANNON.Vec3(run*move.y, run*move.x, 0);
      this.sphereBody.applyImpulse(force, this.sphereBody.position);
      this.sphereBody.angularVelocity.x += a1.x;
      this.sphereBody.angularVelocity.y += a1.y;
      
      
      if(gp.y.justPressed())
      {
        this.sphereBody.velocity.set(0,0,10);
      }
      
      if(gp.x.pressed())
      {
         this.audio.gain.gain.value = !!this.audio.gain.gain.value;
      }
      
      if(gp.start.pressed())
      {
        this.sphereBody.position.set(0,0,2);
        this.sphereBody.velocity.set(0,0,0);
        this.sphereBody.angularVelocity.set(0,0,0);
        this.sphereBody.quaternion.set(0,0,0,1);
      }
    }
    var notes = this.seq.update(d);
    for(let n in notes)
    {
      this.msynth.noteOn(notes[n].getMidi(), notes[n].mag*10);
    }
    var snotes = [];
    for(let i=0; i<this.shepn; ++i)
    {
      snotes[i] = this.shep[i].update(d);
      for(let n in snotes[i])
      {
        //this.shepsynth[i].noteOn(snotes[i][n].getMidi(), snotes[i][n].mag*10);
      }
    }
  };
  ThisGame.prototype.draw = function()
  {
    this.sphereObj.position.copy(this.sphereBody.position);
    this.sphereObj.quaternion.copy(this.sphereBody.quaternion);
    
    THREE.glTFAnimator.update();
    
     this.camtrack.update();
    
    Game.prototype.draw.call(this);
  };
  
  return ThisGame;
});
