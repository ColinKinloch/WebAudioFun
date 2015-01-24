/*global define*/
/*jslint bitwise: true */
'use strict';
define([ 'jquery', 'stats', 'dat-GUI', 'ThisGame'],
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
  
  var capture = function(e)
  {
    e.currentTarget.requestPointerLock();
  };
  var mouseMove = function(e)
  {
    g.mouse(e.movementX, e.movementY)
  };
  var lockChange = function(e)
  {
    if(document.pointerLockElement === canvas[0])
    {
      e.currentTarget.addEventListener('mousemove', mouseMove);
    }
    else
    {
      e.currentTarget.removeEventListener('mousemove', mouseMove);
    }
  };
  canvas.on('dblclick', capture);
  $(document).on('pointerlockchange', lockChange);
  
  canvas.on('movement');
  
  var visible = function(e)
  {
    if(document.hidden)
    {
      //g.listener.context.suspend();
    }
    else
    {
      //g.listener.context.resume();
    }
  };
  $(document).on('visibilitychange', visible);
  
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

