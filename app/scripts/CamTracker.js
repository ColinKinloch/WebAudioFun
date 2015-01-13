/*global define*/
'use strict';
define(['THREE'],
function(THREE){
  var CamTracker = function(camera, target, distance, damping)
  {
    this.camera = camera;
    this.target = target;
    this.damping = damping;
    this.distance = distance;
  };
  
  CamTracker.prototype.update = function()
  {
    var dist = new THREE.Vector3().subVectors(this.camera.position, this.target.position);
    if(dist.length()>=this.distance+1)
    {
      this.camera.position.sub(dist.multiplyScalar(this.damping));
      //console.log('far');
    }
    else if(dist.length()<=(this.distance-1))
    {
      this.camera.position.add(dist.multiplyScalar(this.damping*3));
      //console.log('close');
    }
    
    //this.camera.position.add(this.target.position.sub(this.camera.position ).multiplyScalar(0.5));
    //this.camera.translateZ(-10);
    this.camera.lookAt(this.target.position);
  };
  
  return CamTracker;
});
