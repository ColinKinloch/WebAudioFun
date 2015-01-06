/*global require, AudioContext*/
/*jslint bitwise: true */
'use strict';
require.config({
  baseUrl: 'scripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery',
    'bootstrap': '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',
    'text': '../bower_components/requirejs-text/text',
    'stats': '../bower_components/stats.js/build/stats.min',
    'THREE': '../bower_components/threejs/build/three',
    'dat-GUI': '../bower_components/dat-gui/build/dat.gui',
    'glTF': '../lib/gltf/',
    'CANNON': '../bower_components/cannon.js/build/cannon'
  },
  shim: {
    bootstrap: ['jquery'],
    stats: {
      exports: 'Stats'
    },
    THREE: {
      exports: 'THREE'
    },
    CANNON: {
      exports: 'CANNON'
    },
    'dat-GUI': {
      exports: 'dat'
    },
    'glTF/glTFLoaderUtils': {
      exports: 'THREE'
    },
    'glTF/glTFAnimation': {
      exports: 'THREE'
    },
    'glTF/glTFLoader': {
      exports: 'THREE',
      deps: [
        'glTF/glTF-parser',
        'glTF/glTFLoaderUtils',
        'glTF/glTFAnimation'
      ]
    }
  }
});
require([ 'jquery', 'stats', 'dat-GUI', 'Game', 'THREE', 'CANNON', 'PolySynth', 'MonoSynth', 'SimpleSeq', 'furElise', 'glTF/glTFLoader'],
function(  $      ,  Stats ,  dat     ,  Game ,  THREE ,  CANNON ,  PolySynth ,  MonoSynth ,  SimpleSeq ,  furElise)
{
  var renderStat = new Stats();
  var loopStat = new Stats();
  $('#overlay').prepend(loopStat.domElement);
  $('#overlay').prepend(renderStat.domElement);
  
  var canvas = $('#main');
  var g = new Game(canvas[0]);
  
  var world = g.world;
  
  var sphereBody = new CANNON.Body({
    mass: 5
  });
  var sphereShape = new CANNON.Sphere(1);
  sphereBody.addShape(sphereShape);
  sphereBody.position.set(0,0,100);
  sphereBody.angularVelocity.set(0,10,0);
  world.add(sphereBody);
  
  var groundBody = new CANNON.Body({
    mass: 0
  });
  var groundShape = new CANNON.Plane();
  groundBody.addShape(groundShape);
  world.add(groundBody);
  
  var gui = new dat.GUI();
  
  var scenef = gui.addFolder('Scene');
  var sceneData = {
    volume:0.5
  };
  
  var synthf = gui.addFolder('Synth');
  
  var scene = g.scene
  
  var renderer = g.renderer;
  var camera = g.camera;
  
  var monster;
  var loader = new THREE.glTFLoader;
  console.log(loader);
  loader.load('/res/models/monster.json', function(data){
    console.log(data);
    var scale = 0.001;
    monster = data.scene;
    monster.scale.set(scale, scale, scale);
    //monster.rotation.x = -0.5*Math.PI;
    console.log(monster);
    monster.children[0].children[0].material.shading = THREE.SmoothShading;
    scene.add(monster);
    for(var i=0; i< data.animations.length; i++)
    {
      var anim = data.animations[i];
      anim.loop = true;
      anim.duration = 3;
      anim.play();
    }
  });
  
  var t = window.performance.now();
  var time = window.performance.now();
  var paused = true;
  
  var pads = navigator.getGamepads();
  
  var light = new THREE.AmbientLight(new THREE.Color(0xffffff));
  scene.add(light);
  
  var plight = new THREE.PointLight(new THREE.Color(0xffffff), 1, 1000);
  plight.position.set( 25, 50, 50 );
  scene.add(plight);
  
  var listenObj = new THREE.Mesh(
    new THREE.SphereGeometry(1,20,10),
    new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x0066ff),
      ambient: new THREE.Color(0x050505),
      emissive: new THREE.Color(0x000000),
      specular: new THREE.Color(0x999999),
      shininess: 30,
      shading: THREE.FlatShading,
      vertexColors: THREE.FaceColors
    })
  );
  scene.add(listenObj);
  listenObj.position.set(0,0,-10);
  
  var ground = new THREE.Mesh(
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
  scene.add(ground)
  
  var midi;
  var listener = g.listener;
  var context = listener.context;
  
  
  
  var audio = new THREE.Audio(listener);
  audio.load('/res/audio/ele.wav');
  audio.setLoop(-1);
  listenObj.add(audio);
  
  
  scenef.add(audio.gain.gain, 'value').min(0.0).max(1).step(0.001).name('Volume');
  scenef.add(listener.context.listener, 'dopplerFactor').min(0.0).max(2).name('Doppler Effect');
  scenef.add(listener.context.listener, 'speedOfSound').min(0.0).max(686).name('Speed of Sound');
  
  
  var inst = new PolySynth(context, {
    voices: 16
  });
  inst.connect(audio.panner);
  var seq = new SimpleSeq(furElise);
  seq.bpm = 400;
  var msynth = new PolySynth(context);
  msynth.connect(audio.panner);
  
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
      paused = false;
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
  var width, height;
  var resize = function(e)
  {
    var w = e.target.innerWidth;
    var h = e.target.innerHeight;
    var r = w/h;
    renderer.setSize(w,h);
    camera.aspect = r;
    camera.updateProjectionMatrix();
    width = w;
    height = h;
  };
  $(window).resize(function(e){resize.call(g,e)});
  
  $(window).resize();
  synthf.add(seq, 'bpm').min(60).max(1000).name('BPM');
  
  var visibilityHandler = function(e)
  {/*
    paused = document.hidden;
    audio.gain.gain.value = !document.hidden
  */};
  
  document.addEventListener('visibilitychange', visibilityHandler, false);
  
  var ticker = 0;
  var loop = function(t, frame)
  {
    g.loop(t, frame);
    pads = navigator.getGamepads();
    THREE.glTFAnimator.update();
    var pad = pads[0];
    listenObj.position.copy(sphereBody.position);
    listenObj.quaternion.copy(sphereBody.quaternion);
    
    if(pad !== undefined)
    {
      var x = pad.axes[0];
      var y = pad.axes[1];
      var x2 = pad.axes[2];
      var y2 = pad.axes[3];
      var movSpeed = new THREE.Vector2(0.1,0.1);
      var rotScale = new THREE.Vector2(-0.01, -0.01);
      var run = 1;
      
      if(pad.buttons[2].pressed)
      {
        run = 100;
      }
      
      camera.translateX(x*movSpeed.x*run);
      camera.translateZ(y*movSpeed.y*run);
      camera.rotateOnAxis(new THREE.Vector3(1,0,0),y2*rotScale.y);
      camera.rotateOnAxis(new THREE.Vector3(0,1,0),x2*rotScale.x);
      
      /*listenObj.position.x = Math.cos(t*0.005)*(5);
      listenObj.position.z = Math.sin(t*0.005)*(5);*/
      if(pad.buttons[5].pressed)
      {
        camera.position.set(0,0,0);
        camera.rotation.set(0,0,0);
      }
      if(pad.buttons[3].pressed)
      {
        audio.gain.gain.value = !audio.gain.gain.value;
      }
      
    }
    var tick = Math.floor((t*0.000016)*seq.bpm%2);
    if(ticker !== tick)
    {
      ticker = tick;
      var note = seq.current();
      msynth.update([0x80, note.getMidi(), 0]);
      note= seq.next();
      msynth.update([0x90, note.getMidi(), note.mag*10]);
    }
  };
  var main = function()
  {
    var now = window.performance.now();
    var frame = now - time;
    time = now;
    loopStat.begin();
    if(!paused && !document.hidden)
    {
      loop(t,frame);
      t += frame;
    }
    loopStat.end();
  };
  var draw = function()
  {
    renderStat.begin();
    renderer.render(scene, camera);
    renderStat.end();
    window.requestAnimationFrame(draw);
  };
  g.draw();
  setInterval(main, 0);
});

