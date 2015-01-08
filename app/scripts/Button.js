/*global define*/
'use strict';
define([],
function(){
  var current = 2;
  var last = 2;
  var Button = function(button)
  {
    this.button = button || null;
  };
  
  Button.prototype.poll = function()
  {
    if(this.button)
    {
      var p = parseInt(Number(this.button.pressed));
      if(this.pressed()!==Boolean(p%2))
      {
        current = p;
      }
    }
  };
  Button.prototype.update = function()
  {
    if((last == 0)&&(current == 0))
      current = 2;
    else if((last = 1)&&(current == 1))
      current = 3;
    last = current;
  };
  Button.prototype.pressed = function()
  {
    return Boolean(current%2);
  };
  Button.prototype.justPressed = function()
  {
    return Boolean(current === 1);
  };
  Button.prototype.justReleased = function()
  {
    return Boolean(current === 0);
  };
  Button.prototype.set = function(status)
  {
    current = parseInt(Number(status));
  };
  return Button;
});
