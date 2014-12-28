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
require([ 'jquery', 'stats', 'THREE', 'PolySynth', 'MonoSynth', 'Note', 'SimpleSeq'],
function(  $      ,  Stats ,  THREE , Instrument ,  MonoSynth ,  Note ,  SimpleSeq)
{
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
  
  var listenObj = new THREE.Object3D();
  
  var midi;
  var context = new AudioContext();
  var gain = context.createGain();
  var panner = context.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  var listener = context.listener;
  listener.dopplerFactor = 1;
  listener.speedOfSound = 343.3;
  
  moveListener(listenObj, listener);
  
  var inst = new Instrument(context, {
    voices: 16
  });
  //inst = new MonoSynth(context);
  gain.connect(panner);
  panner.connect(context.destination);
  inst.connect(gain);
  var seq = new SimpleSeq([
    new Note('e4', 1),
    new Note('d#4', 1),
    new Note('e4', 1),
    new Note('d#4', 1),
    new Note('e4', 1),
    new Note('b', 1),
    new Note('d4', 1),
    new Note('c4', 1),
    new Note('a', 1),
    new Note('a1', 1),
    new Note('e2', 1),
    new Note('a2', 1),
    new Note('c', 1),
    new Note('e', 1),
    new Note('a', 1),
    new Note('b', 1),
    new Note('e1', 1),
    new Note('e2', 1),
    new Note('g#2', 1),
    new Note('e', 1),
    new Note('g#', 1),
    new Note('b', 1),
    new Note('c4', 1),
    new Note('a1', 1),
    new Note('e2', 1),
    new Note('a2', 1),
    new Note('e', 1),
    new Note('e4', 1),
    new Note('d#4', 1),
    new Note('e4', 1),
    new Note('d#4', 1),
    new Note('e4', 1),
    new Note('b', 1),
    new Note('d4', 1),
    new Note('c4', 1),
    new Note('a', 1),
    new Note('a1', 1),
    new Note('e2', 1),
    new Note('a2', 1),
    new Note('c', 1),
    new Note('e', 1),
    new Note('a', 1),
    new Note('b', 1),
    new Note('e1', 1),
    new Note('e2', 1),
    new Note('g#2', 1),
    new Note('c', 1),
    new Note('c4', 1),
    new Note('b', 1),
    new Note('a', 1),
    new Note('a1', 1),
    new Note('e2', 1),
    new Note('a2', 1),
    new Note('b', 1),
    new Note('c4', 1),
    new Note('d4', 1),
    new Note('e4', 1),
    new Note('c2', 1),
    new Note('g2', 1),
    new Note('c', 1),
    new Note('g', 1),
    new Note('f4', 1),
    new Note('e4', 1),
    new Note('d4', 1),
    new Note('g1', 1),
    new Note('g2', 1),
    new Note('b2', 1),
    
    new Note('e', 1),
    new Note('e4', 1),
    new Note('d4', 1),
    new Note('c4', 1),
    new Note('e1', 1),
    new Note('e2', 1),
    new Note('e3', 1),
    new Note('e4', 1),
    new Note('e5', 1),
  ]);
  seq.bpm = 400;
  var msynth = new Instrument(context);
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
    //var r = w/h;
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
      var rotScale = 0.05;
      listenObj.translateX(x);
      listenObj.translateY(y);
      listenObj.rotateOnAxis(new THREE.Vector3(1,0,0),y2*rotScale);
      listenObj.rotateOnAxis(new THREE.Vector3(0,1,0),x2*rotScale);
      moveListener(listenObj, listener);
    }
    var tick = Math.floor((t*0.000016)*seq.bpm%2);
    if(ticker !== tick)
    {
      ticker = tick;
      var note= seq.current();
      msynth.update([0x80, note.getMidi(), 0]);
      note= seq.next();
      msynth.update([0x90, note.getMidi(), note.mag*127]);
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

