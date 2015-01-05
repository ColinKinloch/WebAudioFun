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
    'glTF-parser': '../lib/gltf/glTF-parser',
    'glTFLoaderUtils': '../lib/gltf/glTFLoaderUtils',
    'glTFLoader': '../lib/gltf/glTFLoader',
    'glTFAnimation': '../lib/gltf/glTFAnimation'
  },
  shim: {
    bootstrap: ['jquery'],
    stats: {
      exports: 'Stats'
    },
    THREE: {
      exports: 'THREE'
    },
    'dat-GUI': {
      exports: 'dat'
    },
    'glTFLoaderUtils': {
      exports: 'THREE'
    },
    'glTFAnimation': {
      exports: 'THREE'
    },
    'glTFLoader': {
      exports: 'THREE',
      deps: [
        'glTF-parser',
        'glTFLoaderUtils',
        'glTFAnimation'
      ]
    }
  }
});
require([ 'jquery', 'stats', 'dat-GUI', 'THREE', 'PolySynth', 'MonoSynth', 'Note', 'SimpleSeq', 'furElise', 'glTFLoaderUtils', 'glTFLoader'],
function(  $      ,  Stats ,  dat     ,  THREE ,  PolySynth ,  MonoSynth ,  Note ,  SimpleSeq ,  furElise)
{
  var renderStat = new Stats();
  var loopStat = new Stats();
  $('#overlay').prepend(loopStat.domElement);
  $('#overlay').prepend(renderStat.domElement);
  
  var gui = new dat.GUI();
  
  var scenef = gui.addFolder('Scene');
  var sceneData = {
    volume:0.5
  };
  
  var synthf = gui.addFolder('Synth');
  
  var canvas = $('#main');
  var scene = new THREE.Scene();
  
  var renderer = new THREE.WebGLRenderer({canvas: canvas[0], antialias: false});
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  
  var monster;
  var loader = new THREE.glTFLoader;
  console.log(loader);
  loader.load('/res/models/monster.json', function(data){
    console.log(data);
    var scale = 0.001;
    monster = data.scene;
    monster.scale.set(scale, scale, scale);
    monster.rotation.x = -0.5*Math.PI;
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
  
  var light = new THREE.AmbientLight(0xffffff);
  scene.add(light);
  
  var plight = new THREE.PointLight(0xff0, 1, 1000);
  plight.position.set( 25, 50, 50 );
  scene.add(plight);
  
  var listenObj = new THREE.Mesh(
    new THREE.SphereGeometry(1,20,10),
    new THREE.MeshPhongMaterial({
      ambient: 0xaaa,
      color: new THREE.Color(0x0ff),
      specular: 0x009900,
      shininess: 30,
      diffuse: new THREE.Color(0x000),
      shading: THREE.FlatShading,
      vertexColors: THREE.FaceColors
    })
  );
  scene.add(listenObj);
  listenObj.position.set(0,0,-10);
  
  var midi;
  var listener = new THREE.AudioListener();
  var context = listener.context;//new AudioContext();
  var gain = context.createGain();
  
  
  
  var audio = new THREE.Audio(listener);
  audio.load('/res/audio/ele.wav');
  audio.setLoop(-1);
  listenObj.add(audio);
  
  
  scenef.add(audio.gain.gain, 'value').min(0.0).max(1).step(0.001).name('Volume');
  scenef.add(listener.context.listener, 'dopplerFactor').min(0.0).max(2).name('Doppler Effect');
  scenef.add(listener.context.listener, 'speedOfSound').min(0.0).max(686).name('Speed of Sound');
  
  
  camera.add(listener);
  
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
  $(window).resize(resize);
  
  $(window).resize();
  synthf.add(seq, 'bpm').min(60).max(1000).name('BPM');
  
  var ticker = 0;
  var loop = function(t/*, frame*/)
  {
    pads = navigator.getGamepads();
    THREE.glTFAnimator.update();
    var pad = pads[1];
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
      
      listenObj.position.x = Math.cos(t*0.005)*(5);
      listenObj.position.z = Math.sin(t*0.005)*(5);
      
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
    if(!paused)
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
  draw();
  setInterval(main, 0);
});

