/*global define*/
'use strict';
define([],
function(){
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
    this.connect(context.destination);
  };
  Instrument.prototype.connect = function(output)
  {
    this.env.connect(output);
  };
  Instrument.prototype.midi = function(midi)
  {
    var type = midi[0];
    var key = midi[1];
    var mag = midi[2];
    console.log(type,key,mag);
    switch(type)//down
    {
      case 0x90:
        this.noteOn(key, mag);
        break;
      case 0x80:
        this.noteOff(key);
        break;
      case 0xb0:
        this.sustain = mag;
        this.noteOff();
        break;
      case 0xe0:
        this.bend = mag;
        break;
    };
  };
  Instrument.prototype.noteOn = function(key, mag)
  {
    this.notes.push(key);
  };
  Instrument.prototype.noteOff = function(key)
  {
    var i = this.notes.indexOf(key);
    if(i!=-1)
    {
      this.notes.splice(i,1);
    }
  };
  return Instrument;
});
