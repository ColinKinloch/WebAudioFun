/*global define*/
'use strict';
define([],
function(){
  var Instrument = function(context)
  {
    this.notes = {};
    this.order = [];
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
    
    var i = this.order.indexOf(key);
    if(mag===0)
    {
      if(i!==-1)
      {
        this.order.splice(i,1);
      }
    }
    else
    {
      if(i!==-1)
      {
        this.order.splice(i,1);
        
      }
      this.order.push(key);
    }
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
