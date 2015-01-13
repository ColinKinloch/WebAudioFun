/*global define*/
'use strict';
define([],
function(){
  var Button = function(button)
  {
    this.current = 2;
    this.last = 2;
    this.button = button || null;
  };
  
  Button.prototype.poll = function()
  {
    if(this.button)
    {
      var p = parseInt(Number(this.button.pressed));
      if(this.pressed()!==Boolean(p%2))
      {
        this.current = p;
      }
    }
  };
  Button.prototype.update = function()
  {
    if((this.last === 0)&&(this.current === 0))
    {
      this.current = 2;
    }
    else if((this.last === 1)&&(this.current === 1))
    {
      this.current = 3;
    }
    this.last = this.current;
  };
  Button.prototype.pressed = function()
  {
    return Boolean(this.current%2);
  };
  Button.prototype.justPressed = function()
  {
    return Boolean(this.current === 1);
  };
  Button.prototype.justReleased = function()
  {
    return Boolean(this.current === 0);
  };
  Button.prototype.set = function(status)
  {
    this.current = parseInt(Number(status));
  };
  return Button;
});

