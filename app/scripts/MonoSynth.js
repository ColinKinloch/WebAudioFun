/*global define*/
'use strict';
define(['Instrument'],
function(Instrument){
  var MonoSynth = function(context)
  {
    Instrument.call(this, context);
    this.osc = context.createOscillator();
    this.osc.type = 'triangle';
    this.osc.start();
    this.env = context.createGain();
    this.osc.connect(this.env);
    this.connect(context.destination);
    this.env.gain.value = 0.0;
  };
  
  MonoSynth.prototype = Object.create(Instrument.prototype);
  
  MonoSynth.prototype.constructor = MonoSynth;
  
  MonoSynth.prototype.noteOn = function(key, mag)
  {
    Instrument.prototype.noteOn.call(this, key, mag);
    this.osc.frequency.cancelScheduledValues(0);
    this.osc.frequency.setTargetAtTime( 440 * Math.pow(2,(key-69)/12), 0, 0.08 );
    this.env.gain.cancelScheduledValues(0);
    this.env.gain.setTargetAtTime(mag/127, 0, 0.05)
  };
  MonoSynth.prototype.noteOff = function(key)
  {
    Instrument.prototype.noteOff.call(this, key);
    if(!this.sustain)
    if(this.notes.length===0)
    {
      this.env.gain.cancelScheduledValues(0);
      this.env.gain.setTargetAtTime(0.0, 0, 0.05 );
    } else {
      this.osc.frequency.cancelScheduledValues(0);
      this.osc.frequency.setTargetAtTime( 440 * Math.pow(2,(this.notes[this.notes.length-1]-69)/12), 0, 0.05 );
    }
  };
  
  return MonoSynth;
});
