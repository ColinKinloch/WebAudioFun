/*global define*/
'use strict';
define(['THREE'],
function(THREE){
  var Axis = function(object, property, axisX, axisY)
  {
    this.object = object;
    this.property = property;
    this.axisX = axisX;
    this.axisY = axisY;
    
    this.length = 2;
    
    this.state = [];
    
    for(let i=0; i<this.length;++i)
    {
      this.state.push(new THREE.Vector2());
    }
  };
  
  Axis.prototype.poll = function()
  {
    this.state.push(new THREE.Vector2().set(this.object[this.property][this.axisX], this.object[this.property][this.axisY]));
    if(this.state.length > this.length)
    {
      this.state.shift();
    }
  };
  Axis.prototype.get = function()
  {
    return this.state[this.state.length-1];
  };
  Axis.prototype.delta = function()
  {
    return new THREE.Axis2().copy(this.state[this.state.length-1]).sub(this.state[this.state.length-2]);
  };
  
  return Axis;
});
