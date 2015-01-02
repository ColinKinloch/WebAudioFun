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
    'THREE': '../bower_components/threejs/build/three'
  },
  shim: {
    bootstrap: ['jquery'],
    stats: {
      exports: 'Stats'
    },
    THREE: {
      exports: 'THREE'
    }
  }
});
require([ 'jquery', 'stats', 'THREE', 'PolySynth', 'MonoSynth', 'Note', 'SimpleSeq', 'furElise'],
function(  $      ,  Stats ,  THREE ,  PolySynth ,  MonoSynth ,  Note ,  SimpleSeq ,  furElise)
{
  var canvas = $('#main');
  var scene = new THREE.Scene();
  
  var renderer = new THREE.WebGLRenderer({canvas: canvas[0], antialias: false});
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  
  var t = window.performance.now();
  var time = window.performance.now();
  var paused = true;
  
  var pads = navigator.getGamepads();
  
  var moveListener = function(obj, lis)
  {
    lis.setPosition(obj.position.x, obj.position.y, obj.position.z);
    lis.setOrientation(obj.rotation.x, obj.rotation.y, obj.rotation.z,
                            obj.up.x, obj.up.y, obj.up.z);
  };
  
  
  var light = new THREE.AmbientLight(0x0f0);
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
  var context = new AudioContext();
  var gain = context.createGain();
  var panner = context.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  var listener = context.listener;
  listener.dopplerFactor = 1;
  listener.speedOfSound = 343.3;
  
  moveListener(camera, listener);
  moveListener(listenObj, panner);
  
  var inst = new PolySynth(context, {
    voices: 16
  });
  //inst = new MonoSynth(context);
  gain.connect(panner);
  panner.connect(context.destination);
  inst.connect(gain);
  var seq = new SimpleSeq(furElise);
  seq.bpm = 400;
  var msynth = new MonoSynth(context);
  msynth.connect(gain);
  
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
  
  $('#volume').on('change mousemove',function(){
    gain.gain.value = $(this).val();
    $('#volumeout').html(gain.gain.value);
  });
  $('#volume').change();
  $('#bpm').on('change mousemove',function(){
    seq.bpm = $(this).val();
    $('#bpmout').html(seq.bpm);
  });
  $('#bpm').change();
  
  var ticker = 0;
  var loop = function(t/*, frame*/)
  {
    pads = navigator.getGamepads();
    var pad = pads[0];
    if(pad !== undefined)
    {
      var x = pad.axes[0];
      var y = pad.axes[1];
      var x2 = pad.axes[2];
      var y2 = pad.axes[3];
      var movSpeed = new THREE.Vector2(0.1,0.1);
      var rotScale = new THREE.Vector2(-0.01, -0.01);
      camera.translateX(x*movSpeed.x);
      camera.translateZ(y*movSpeed.y);
      camera.rotateOnAxis(new THREE.Vector3(1,0,0),y2*rotScale.y);
      camera.rotateOnAxis(new THREE.Vector3(0,1,0),x2*rotScale.x);
      
      listenObj.position.x = Math.cos(t*0.005)*(5);
      listenObj.position.z = Math.sin(t*0.005)*(5);
      if(pad.buttons[9].pressed)
      {
        camera.position.set(0,0,0);
        camera.rotation.set(0,0,0);
      }
      
      moveListener(camera, listener);
      moveListener(listenObj, panner);
    }
    var tick = Math.floor((t*0.000016)*seq.bpm%2);
    if(ticker !== tick)
    {
      ticker = tick;
      var note= seq.current();
      msynth.update([0x80, note.getMidi(), 0]);
      note= seq.next();
      msynth.update([0x90, note.getMidi(), note.mag*10]);
    }
    /*
    var speed = 0.005;
    var dist = 3;
    listener.setPosition(Math.cos(t*speed)*dist,Math.sin(t*speed)*dist,0);
    */
  };
  var main = function()
  {
    var now = window.performance.now();
    var frame = now - time;
    time = now;
    if(!paused)
    {
      loop(t,frame);
      t += frame;
    }
  };
  var draw = function()
  {
    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
  };
  draw();
  setInterval(main, 0);
});

