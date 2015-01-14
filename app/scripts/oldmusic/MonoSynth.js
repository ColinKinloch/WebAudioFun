/*global define*/
'use strict';
define(['./Synth', './Voice', './Note'],
function(Synth,   Voice ,  Note){
  var MonoSynth = function(context)
  {
    Synth.call(this, context);
    this.voice = new Voice(context);
    this.voice.start();
    this.voice.env.gain.value = 0.0;
    this.voice.connect(this.out);
    this.order = [];
  };
  
  MonoSynth.prototype = Object.create(Synth.prototype);
  MonoSynth.prototype.constructor = MonoSynth;
  
  MonoSynth.prototype.update = function(midi)
  {
    Synth.prototype.update.call(this, midi);
    //this.env.gain.value = this.volume;
    
  };
  MonoSynth.prototype.noteOn = function(key, mag)
  {
    Synth.prototype.noteOn.call(this, key, mag);
    this.voice.osc.frequency.cancelScheduledValues(0);
    this.voice.osc.frequency.setTargetAtTime( Note.midiToFreq(key), 0, 0.08 );
    this.voice.env.gain.cancelScheduledValues(0);
    this.voice.env.gain.setTargetAtTime(mag/127, 0, 0.05);
  };
  MonoSynth.prototype.noteOff = function(key, mag)
  {
    Synth.prototype.noteOff.call(this, key, mag);
    if(this.order.length===0)
    {
      this.voice.env.gain.cancelScheduledValues(0);
      this.voice.env.gain.setTargetAtTime(0.0, 0, 0.05 );
    } else {
      this.voice.osc.frequency.cancelScheduledValues(0);
      this.voice.osc.frequency.setTargetAtTime( Note.midiToFreq(this.order[this.order.length-1]), 0, 0.05 );
    }
  };
  
  return MonoSynth;
});
