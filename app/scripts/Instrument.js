/*global define*/
'use strict';
define(['Note'],
function(Note){
  var keyToFreq = function(key)
  {
    return 440 * Math.pow(2,(key-69)/12);
  };
  
  var Instrument = function(context)
  {
    this.notes = {};
    this.sustain = 0;
    this.bend = 64;
    this.env = context.createGain();
    this.env.gain.value = 0.0;
    //this.connect(context.destination);
  };
  Instrument.prototype.update = function()
  {
  };
  Instrument.prototype.note = function(key, mag)
  {
    this.notes[key] = mag;
  };
  Instrument.prototype.noteOn = function(key, mag)
  {
    this.note(key, mag);
  };
  Instrument.prototype.noteOff = function(key, mag)
  {
    this.note(key, mag);
    //var i = Note.find(this.notes, key);
    
    /*if(this.notes[key] === undefined)
    {
      this.notes[key] = undefined;
    }*/
  };
  return Instrument;
});
