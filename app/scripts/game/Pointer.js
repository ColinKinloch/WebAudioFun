/*global define*/
'use strict';
define(['./Axis'],
function(Axis){
  const ButtonMap = [
    'left',
    'right',
    'center'
  ];
  var Pointer = function()
  {
    this.pos = new Axis();
    
  };
  
  Pointer.prototype.set = function(x, y)
  {
    this.pos.set(x,y);
  }
  
  return Pointer;
});
