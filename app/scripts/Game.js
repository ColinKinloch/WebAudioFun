/*global define*/
'use strict';
define(['THREE', 'CANNON'],
function(THREE ,  CANNON){
  var Game = function(canvas)
  {
    this.height = canvas.innerHeight;
    this.width = canvas.innerWidth;
    this.paused = false;
    
    //Renderer
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    
    this.camera = new THREE.PerspectiveCamera(75, this.width/this.height, 0.1, 1000);
    this.camera.up.set(0,0,1);
    this.camera.position.set(10,1,10);
    this.camera.lookAt(new THREE.Vector3(0,1,1));
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
    
    this.scene.add(this.camera);
    
    //Physics
    this.world = new CANNON.World();
    this.world.gravity.set(0,0,-9.81);
    this.world.broadphase = new CANNON.NaiveBroadphase();
  };
  
  Game.prototype.resize = function(e)
  {
    var w = e.target.innerHeight;
    var h = e.target.innerWidth;
    var r = w/h;
    this.renderer.setSize(w,h);
    this.camera.aspect = r;
    this.camera.updateProjectionMatrix();
    this.width = w;
    this.height = h;
  };
  Game.prototype.loop = function(t, d)
  {
    this.world.step(d/1000);
  };
  Game.prototype.draw = function()
  {
    this.renderer.render(this.scene, this.camera);
    var that = this;
    window.requestAnimationFrame(function(){that.draw.call(that)});
  };
  return Game;
});
