/*global define*/
'use strict';
define(['THREE', 'CANNON', 'glTF/threejs/glTFLoader', 'glTF/threejs/glTFAnimation'],
function(THREE ,  CANNON ,               glTFLoader ,               glTFAnimation){
  var LevelLoader = function()
  {
    this.glTFLoader = new glTFLoader();
    this.glTFLoader.useBufferGeometry = false;
    
    this.animator = glTFAnimation.glTFAnimator;
  };
  
  LevelLoader.prototype.load = function(game, file, callback)
  {
    return this.glTFLoader.load(file, function(data){
      console.log(data.scene.children[0]);
      callback(data);
    });
  };
  
  return LevelLoader;
});
