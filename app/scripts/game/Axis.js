/*global define*/
'use strict';
define(['THREE'],
function(THREE){
  var Axis = function(axis, offset)
  {
    this.axis = axis;
    this.offset = offset;
  };
  
  Axis.prototype = Object.create(THREE.Vector2.prototype);
  Axis.prototype.constructor = Axis;
  
  Axis.prototype.poll = function()
  {
    this.set(this.axis[0+2*this.offset],this.axis[1+2*this.offset]);
  };
  
  return Axis;
});
