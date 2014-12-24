/*global define*/
'use strict';
define([],
function(){
  var Voice = function(context)
  {
    this.env = context.createGain();
    this.osc = context.createOscillator();
    this.osc.connect(this.env);
    this.mag = 0.0;
    this.type = 'sine';
    this.update();
  };
  Voice.prototype.connect = function(output)
  {
    this.env.connect(output);
  };
  Voice.prototype.update = function()
  {
    this.env.gain.value = this.mag;
    this.osc.type = this.type;
  };
  Voice.prototype.start = function()
  {
    this.osc.start();
  };
  return Voice;
});
