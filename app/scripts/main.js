/*global require, AudioContext*/
/*jslint bitwise: true */
'use strict';
require.config({
  baseUrl: 'scripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery',
    'bootstrap': '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',
    'text': '../bower_components/requirejs-text/text',
    'stats': '../bower_components/stats.js/build/stats.min'
  },
  shim: {
    bootstrap: ['jquery'],
    stats: {
      exports: 'Stats'
    }
  }
});
require([ 'jquery', 'stats', 'PolySynth', 'MonoSynth' ],
function(  $      ,  Stats ,  Instrument ,  MonoSynth  )
{
  var t = window.performance.now();
  var time = window.performance.now();
  var paused = true;
  
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
    voices: 32
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
    console.log('midi success');
    if (midi.inputs.length === 0)
    {
      console.error('no devices');
    }
    var inputs = midi.inputs.values();
    for(var input = inputs.next(); input && !input.done; input = inputs.next())
    {
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
    console.log(gain.gain.value);
  });
  $('#volume').change();
  
  var loop = function(t, frame)
  {
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
