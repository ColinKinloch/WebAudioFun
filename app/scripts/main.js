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
    'glTF': '../bower_components/glTF/loaders/',
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
    'glTF/threejs/glTFLoaderUtils': {
      exports: 'THREE'
    },
    'glTF/threejs/glTFAnimation': {
      exports: 'THREE'
    },
    'glTF/threejs/glTFLoader': {
      exports: 'THREE',
      deps: [
        'THREE',
        'glTF/glTF-parser',
        'glTF/threejs/glTFLoaderUtils',
        'glTF/threejs/glTFAnimation'
      ]
    }
  }
});
require([ 'jquery', 'stats', 'dat-GUI', 'ThisGame', 'THREE', 'CANNON', 'Note', 'PolySynth', 'MonoSynth', 'GoodSeq', 'SimpleSeq', 'CamTracker', 'furElise', 'furEliseGood', 'glTF/threejs/glTFLoader'],
function(  $      ,  Stats ,  dat     ,  Game ,  THREE ,  CANNON ,  Note ,  PolySynth ,  MonoSynth ,  SequencerNew , SimpleSeq ,  CamTracker ,  furElise ,  furEliseGood)
{
  var canvas = $('#main');
  
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
  
  
  var g = new Game(canvas[0]);
  
  var t = window.performance.now();
  var time = window.performance.now();
  var paused = false;
  
  var midi;
  var listener = g.listener;
  var context = listener.context;
  
  /*
  scenef.add(audio.gain.gain, 'value').min(0.0).max(1).step(0.001).name('Volume');
  */
  scenef.add(listener.context.listener, 'dopplerFactor').min(0.0).max(2).name('Doppler Effect');
  scenef.add(listener.context.listener, 'speedOfSound').min(0.0).max(686).name('Speed of Sound');
  
  /*
  var inst = new PolySynth(context, {
    voices: 16
  });
  inst.connect(audio.panner);
  var seq = new SimpleSeq(furElise);
  seq.bpm = 400;
  
  var seq2 = new SequencerNew({
    '0': [new Note('c3', 1), new Note('e3', 1)],
    '1': [new Note('g2', 1), new Note('a3', 1)],
    '2': [new Note('e4', 1), new Note('e3', 0)],
    '3': [new Note('e4', 0), new Note('a3', 0), new Note('c3',0), new Note('g2', 0), 'restart'],
  });
  
  var gap = 1/8;
  var shep1 = new SimpleSeq([
    new Note('c2', gap*0),
    new Note('d2', gap*1),
    new Note('e2', gap*2),
    new Note('f2', gap*3),
    new Note('g2', gap*4),
    new Note('a2', gap*5),
    new Note('b2', gap*6),
    new Note('c3', gap*7),
    new Note('d3', 1),
    new Note('e3', 1),
    new Note('f3', 1),
    new Note('g3', 1),
    new Note('a3', 1),
    new Note('b3', 1),
    new Note('c4', 1),
    new Note('d4', 1),
    new Note('e4', 1),
    new Note('f4', 1),
    new Note('g4', 1),
    new Note('a4', 1),
    new Note('b4', gap*7),
    new Note('c5', gap*6),
    new Note('d5', gap*5),
    new Note('e5', gap*4),
    new Note('f5', gap*3),
    new Note('g5', gap*2),
    new Note('a5', gap*1),
    new Note('b5', gap*0)
  ]);
  var shep2 = Object.create(shep1);
  shep2.i = 7;
  var shep3 = Object.create(shep1);
  shep3.i = 14;
  var shep4 = Object.create(shep1);
  shep4.i = 21;
  
  var msynth = new PolySynth(context);
  msynth.connect(audio.panner);
  var ShepSynth = MonoSynth;
  var shepsynth1 = new ShepSynth(context);
  var shepsynth2 = new ShepSynth(context);
  var shepsynth3 = new ShepSynth(context);
  var shepsynth4 = new ShepSynth(context);
  shepsynth1.connect(audio.panner);
  shepsynth2.connect(audio.panner);
  shepsynth3.connect(audio.panner);
  shepsynth4.connect(audio.panner);
  
  var midiVal=69;
  var onMidi = function(e)
  {
    inst.update(e.data);
    midiVal = e.data[1]
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
  }*/
  var width, height;
  var resize = function(e)
  {
    var w = e.target.innerWidth;
    var h = e.target.innerHeight;
    var r = w/h;
    g.renderer.setSize(w,h);
    g.camera.aspect = r;
    g.camera.updateProjectionMatrix();
    width = w;
    height = h;
  };
  $(window).resize(function(e){resize.call(g,e)});
  
  $(window).resize();
  //synthf.add(seq2, 'speed').min(0.1).max(2).name('BPM');
  
  
  var ticker = 0;
  var loop = function(t, frame)
  {
    var notes = seq2.update(frame);
    for(var n in notes)
    {
      msynth.noteOn(notes[n].getMidi()+(69-midiVal), notes[n].mag*10);
    }
    var tick = Math.floor((t*0.000016)*seq.bpm%2);
    if(ticker !== tick)
    {
      ticker = tick;
      var note = seq.current();
      var note1 = shep1.current();
      var note2 = shep2.current();
      var note3 = shep3.current();
      var note4 = shep4.current();
      //msynth.update([0x80, note.getMidi(), 0]);
      //console.log(note1.mag+note2.mag+note3.mag+note4.mag, note1.getNote(), note2.getNote(), note3.getNote(), note4.getNote());
      shepsynth1.noteOff(note1.getMidi(), 0);
      shepsynth2.noteOff(note2.getMidi(), 0);
      shepsynth3.noteOff(note3.getMidi(), 0);
      shepsynth4.noteOff(note4.getMidi(), 0);
      note = seq.next();
      note1 = shep1.next();
      note2 = shep2.next();
      note3 = shep3.next();
      note4 = shep4.next();
      //msynth.update([0x90, note.getMidi(), note.mag*10]);
      /*
      shepsynth1.noteOn(note1.getMidi(), note1.mag*10);
      shepsynth2.noteOn(note2.getMidi(), note2.mag*10);
      shepsynth3.noteOn(note3.getMidi(), note3.mag*10);
      shepsynth4.noteOn(note4.getMidi(), note4.mag*10);
      */
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
      g.loop(t,frame);
      t += frame;
    }
    loopStat.end();
  };
  var draw = function()
  {
    renderStat.begin();
    g.draw();
    renderStat.end();
    window.requestAnimationFrame(draw);
  };
  draw();
  setInterval(main, 0);
});

