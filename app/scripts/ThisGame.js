/*global define*/
'use strict';
define(['game/Game', 'THREE', 'CANNON', 'THREEex/Cloth', 'game/Pad', 'game/Pointer',  'game/LevelLoader', 'CamTracker', 'game/MiniMap', 'music/Voice', 'music/Note', 'oldmusic/Note', 'oldmusic/GoodSeq', 'oldmusic/ShepardSeq', 'oldmusic/MonoSynth', 'oldmusic/PolySynth', 'furEliseGood'],
function(Game      ,  THREE ,  CANNON , THREEex,       Pad ,       Pointer, LevelLoader       ,  CamTracker ,  MiniMap,  NewVoice    , NewNote     ,  Note          ,  GoodSeq          ,  ShepardSeq          ,  MonoSynth          , PolySynth           ,  furElise){
  
  console.log('ex', THREEex)
  
  var ThisGame = function(canvas)
  {
    
    let that = this;
    
    this.pads = navigator.getGamepads();
    
    this.gp;
    this.pointer = new Pointer();
    
    this.levelLoader = new LevelLoader();
    
    this.shepn = 4;
    this.shep = [];
    this.shepsynth = [];
    
    Game.prototype.constructor.call(this, canvas);
    
    //this.minimap = new MiniMap(this.scene, this.renderer, 10, 10, 100, 100);
    
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
    this.levelLoader.load(this, '/res/models/Sphere.gltf', function(data){
      ball = data.scene.children[0];
      //ball.scale.set(scale, scale, scale);
      //monster.rotation.x = -0.5*Math.PI;
      //that.scene.add(ball);
      //console.log(data.scene.children[0]);
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
     
    /*var aNote = new NewNote('c4', 1, 6.5);
    var aVoice = new NewVoice(context).start().connect(this.audio.panner).sing(aNote);
    aNote.set('c5');
    aNote.set('c2');
    aNote.set('c5');
    aNote.set('c7');
    aNote.length = 1;
    aNote.length = 2;
    aNote.length = 3;
    aNote.length = 1;
    aNote.mag = 0.1;
    aNote.mag = 0.34;
    var bNote = new Note('a2', 2, 5);
    aNote.copy(bNote);*/
    
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
    if(pad !== undefined)
    {
      if(!this.gp)
      {
        this.gp = new Pad(pad);
      }
      var a1 = this.gp.ls.get();
      var a2 = this.gp.rs.get();
      
      this.gp.poll();
      
      var camSp = new THREE.Vector2(0.1,0.1);
      //var rotScale = new THREE.Vector2(-0.01, -0.01);
      var run = 1;
      
      if(this.gp.b.pressed())
      {
        run = 10;
      }
      
      this.camera.translateX(camSp.x*a2.x);
      this.camera.translateY(camSp.y*a2.y);
      
      var angleV = new THREE.Vector2().copy(this.sphereObj.position);
      angleV.sub(new THREE.Vector2().copy(this.camera.position));
      var angle = THREE.Vector3.prototype.angleTo.call(angleV,new THREE.Vector2(1,0,0));
      angle -= Math.PI/2;
      if(angleV.y<0)
      {
        angle = -angle+2*Math.PI;
      }
      angle += Math.PI/2;
      var move = new THREE.Vector3().copy(a1).setZ(0).applyAxisAngle(new THREE.Vector3(0,0,1), angle);
      if(a1.x!==0 || a1.y!==0)
      {
        console.log(angle*(180/Math.PI))
        console.log('m', move.x, move.y);
        console.log('a', a1.x, a1.y);
      }
      var force = new CANNON.Vec3(move.y, move.x, 0);
      this.sphereBody.applyImpulse(force, this.sphereBody.position);
      //this.sphereBody.angularVelocity.x += move.x*0.1;
      //this.sphereBody.angularVelocity.y += move.y*0.1;
      
      
      if(this.gp.y.justPressed())
      {
        this.sphereBody.velocity.set(0,0,10);
      }
      
      if(this.gp.x.pressed())
      {
         this.audio.gain.gain.value = !!this.audio.gain.gain.value;
      }
      
      if(this.gp.start.pressed())
      {
        this.sphereBody.position.set(0,0,2);
        this.sphereBody.velocity.set(0,0,0);
        this.sphereBody.angularVelocity.set(0,0,0);
        this.sphereBody.quaternion.set(0,0,0,1);
      }
      if(this.gp.select.pressed())
      {
        this.camera.position.set(5,0,1);
      }
    }
    var notes = this.seq.update(d);
    for(let n in notes)
    {
      //this.msynth.noteOn(notes[n].getMidi(), notes[n].mag*10);
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
    
    this.levelLoader.animator.update();
    
    this.camtrack.update();
    
    
    Game.prototype.draw.call(this);
    //this.minimap.draw();
  };
  
  ThisGame.prototype.mouse = function(x, y)
  {
    this.pointer.set(x,y);
  };
  
  return ThisGame;
});
