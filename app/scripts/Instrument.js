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
    this.notes = [];
    this.sustain = 0;
    this.bend = 64;
    this.env = context.createGain();
    this.env.gain.value = 0.0;
    //this.connect(context.destination);
  };
  Instrument.prototype.update = function()
  {
    for(var note in this.notes)
    {
      
    }
  };
  Instrument.prototype.noteOn = function(note)
  {
    this.notes.push(note);
  };
  Instrument.prototype.noteOff = function(key)
  {
    var i = Note.find(this.notes, key);
    console.log(i)
    if(i!=-1)
    {
      this.notes.splice(i,1);
    }
  };
  return Instrument;
});
