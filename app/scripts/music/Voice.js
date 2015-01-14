/*global define*/
'use strict';
define([],
function(){
  var Voice = function(context)
  {
    this.env = context.createGain();
    this.osc = context.createOscillator();
    this.osc.connect(this.env);
    this.osc.type = 'sine';
  };
  Voice.prototype.connect = function(output)
  {
    this.env.connect(output);
    return this;
  };
  Voice.prototype.start = function()
  {
    this.osc.start();
    return this;
  };
  Voice.prototype.stop = function()
  {
    this.osc.stop();
    return this;
  };
  Voice.prototype.sing = function(note)
  {
    this.note = note;
    this.osc.frequency.cancelScheduledValues(0);
    this.osc.frequency.value = this.note.getFreq();
    this.env.gain.cancelScheduledValues(0);
    this.env.gain.value = this.note.mag/127;
    if(this.note.length!==Infinity)
    {
      this.env.gain.cancelScheduledValues(0);
      this.env.gain.setValueAtTime(0, this.env.context.currentTime+this.note.length);
    }
  };
  return Voice;
});
