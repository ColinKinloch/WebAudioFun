/*global define*/
'use strict';
define([],
function(){
  var Button = function(button)
  {
    this.state = [];
    this.length = 2;
    this.button = button || null;
  };
  
  Button.prototype.poll = function()
  {
    this.set(this.button.pressed);
  }
  
  Button.prototype.set = function(state)
  {
    this.state.push(state);
    if(this.state.length > this.length)
    {
      this.state.shift();
    }
  };
  
  Button.prototype.pressed = function()
  {
    return this.state[this.state.length-1];
  };
  Button.prototype.justPressed = function()
  {
    return (this.state[this.state.length-1] && !this.state[this.state.length-2]);
  };
  Button.prototype.justReleased = function()
  {
    return (!this.state[this.state.length-1] && this.state[this.state.length-2]);
  };
  
  return Button;
});
