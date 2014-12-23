/*global define*/
'use strict';
define([],
function(){
  var Voice = function(context)
  {
    this.osc = context.createOscillator();
    this.env = context.createGain();
    this.osc.connect(this.env);
    this.env.gain.value = 0.0;
  };
  Voice.prototype.connect = function(output)
  {
    this.env.connect(output);
  };
  return Voice;
});
