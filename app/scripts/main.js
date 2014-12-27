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
require([ 'jquery', 'stats', 'THREE', 'PolySynth', 'MonoSynth'],
function(  $      ,  Stats ,  THREE , Instrument ,  MonoSynth )
{
  var t = window.performance.now();
  var time = window.performance.now();
  var paused = true;
  
  var pads = navigator.getGamepads();
  
  var midi;
  var context = new AudioContext();
  var gain = context.createGain();
  var panner = context.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  var listener = context.listener;
  listener.setPosition(0,0,0);
  listener.dopplerFactor = 1;
  listener.speedOfSound = 343.3;
  listener.setOrientation(0,0,-1,0,1,0);
  var inst = new Instrument(context, {
    voices: 16
  });
  //inst = new MonoSynth(context);
  gain.connect(panner);
  panner.connect(context.destination);
  inst.connect(gain);
  
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
    width = w;
    height = h;
  };
  $(window).resize(resize);
  
  $(window).resize();
  
  $('#volume').on('change mousemove',function(e){
    gain.gain.value = $(this).val();
  });
  $('#volume').change();
  var listenObj = new THREE.Object3D();
  
  var pan = {
    x:0,
    y:0
  };
  var moveListener = function(obj, lis)
  {
    lis.setPosition(obj.position.x, obj.position.y, obj.position.z);
    lis.setOrientation(obj.rotation.x, obj.rotation.y, obj.rotation.z,
                            obj.up.x, obj.up.y, obj.up.z);
  };
  var loop = function(t, frame)
  {
    pads = navigator.getGamepads();
    var pad = pads[0];
    if(pad !== undefined)
    {
      var x = pad.axes[0];
      var y = pad.axes[1];
      var x2 = pad.axes[2];
      var y2 = pad.axes[3];
      var rotScale = 0.05;
      listenObj.translateX(x);
      listenObj.translateY(y);
      listenObj.rotateOnAxis(new THREE.Vector3(1,0,0),y2*rotScale);
      listenObj.rotateOnAxis(new THREE.Vector3(0,1,0),x2*rotScale);
      //moveListener(listenObj, listener);
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
    window.requestAnimationFrame(draw);
  };
  draw();
  setInterval(main, 0);
});

