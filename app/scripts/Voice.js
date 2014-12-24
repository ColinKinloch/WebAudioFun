/*global define*/
'use strict';
define(['Note'],
function(Note){
  var Voice = function(context)
  {
    this.note = new Note();
    this.env = context.createGain();
    this.osc = context.createOscillator();
    this.osc.connect(this.env);
    this.mag = 0.0;
    this.glis = 0;
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
  Voice.prototype.sing = function(note)
  {
    if(note)
      this.note = note;
    this.osc.frequency.cancelScheduledValues(0);
    this.osc.frequency.setTargetAtTime( this.note.getFreq(),0,this.glis);
    this.env.gain.cancelScheduledValues(0);
    this.env.gain.setTargetAtTime(this.note.mag/127, 0, 0.05);
  };
  Voice.find = function(voices, key)
  {
    for(var i = 0; voices.length>i; ++i)
     if(voices[i].note.key===key)
      return i;
  };
  return Voice;
});
