/*global define*/
'use strict';
define(['THREE'],
function(THREE){
  var MiniMap = function(scene, renderer, width, height)
  {
    this.renderer = renderer;
    THREE.WebGLRenderTarget.call(this, {context:this.renderer.getContext()})
    this.setSize(width,height);
    //this.renderer.setSize(width, height);
    this.scene = scene;
    this.camera = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, 1, 1000);
    this.scene.add(this.camera);
    this.camera.position.set(50,0,0);
    this.camera.lookAt(0,0,0);
  };
  
  MiniMap.prototype = Object.create(THREE.WebGLRenderTarget.prototype);
  MiniMap.prototype.constructor = MiniMap;
  
  MiniMap.prototype.draw = function()
  {
    return this.renderer.render(this.scene, this.camera, this, true);
  };
  
  return MiniMap;
});
