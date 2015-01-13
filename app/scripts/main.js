/*global require*/
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
require([ 'jquery', 'stats', 'dat-GUI', 'ThisGame'],
function(  $      ,  Stats ,  dat     ,  Game)
{
  var canvas = $('#main');
  
  var renderStat = new Stats();
  var loopStat = new Stats();
  $('#overlay').prepend(loopStat.domElement);
  $('#overlay').prepend(renderStat.domElement);
  
  
  var gui = new dat.GUI();
  
  var scenef = gui.addFolder('Scene');
  
  var synthf = gui.addFolder('Synth');
  
  
  var g = new Game(canvas[0]);
  
  var t = window.performance.now();
  var time = window.performance.now();
  var paused = false;
  
  scenef.add(g.audio.gain.gain, 'value').min(0.0).max(1).step(0.001).name('Volume');
  
  scenef.add(g.listener.context.listener, 'dopplerFactor').min(0.0).max(2).name('Doppler Effect');
  scenef.add(g.listener.context.listener, 'speedOfSound').min(0.0).max(686).name('Speed of Sound');
  
  var move = function(e)
  {
    console.log(e.movementX, e.movementY);
  };
  
  var capture = function(e)
  {
    e.currentTarget.requestPointerLock();
    e.currentTarget.addEventListener('mousemove', move)
  };
  canvas.on('dblclick', capture);
  
  canvas.on('movement')
  
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
  $(window).resize(function(e){resize.call(g,e);});
  
  $(window).resize();
  synthf.add(g.seq, 'speed').min(0.1).max(2).name('BPM');
  
  var main = function()
  {
    var now = window.performance.now();
    loopStat.begin();
    if(!paused && !document.hidden)
    {
    var frame = now - time;
      g.loop(t,frame);
      t += frame;
    }
    time = now;
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

