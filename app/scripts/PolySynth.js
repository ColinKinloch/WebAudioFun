/*global define*/
'use strict';
define(['Instrument', 'Voice'],
function(Instrument ,  Voice ){
  var PolySynth = function(context, props)
  {
    Instrument.call(this, context);
    this.voices = [];
    this.env = context.createGain();
    for(var i=0;i<props.voices; ++i)
    {
      this.voices[i] = new Voice(context);
      var voice = this.voices[i];
      voice.osc.type = 'triangle';
      voice.osc.start();
      voice.connect(this.env);
      //voice.start();
    }
    this.connect(context.destination);
    this.env.gain.value = 1.0;
  };
  
  PolySynth.prototype = Object.create(Instrument.prototype);
  
  PolySynth.prototype.constructor = PolySynth;
  
  PolySynth.prototype.noteOn = function(key, mag)
  {
    Instrument.prototype.noteOn.call(this, key, mag);
    var i = this.notes.indexOf(key);
    console.log(i)
    var voice = this.voices[i];
    voice.osc.frequency.cancelScheduledValues(0);
    voice.osc.frequency.setTargetAtTime( 440 * Math.pow(2,(key-69)/12), 0, 0.08 );
    voice.env.gain.cancelScheduledValues(0);
    voice.env.gain.setTargetAtTime(mag/127, 0, 0.05)
  };
  PolySynth.prototype.noteOff = function(key)
  {
    var i = this.notes.indexOf(key);
    var voice = this.voices[i];
    Instrument.prototype.noteOff.call(this, key);
    if(!this.sustain)
    {
      voice.env.gain.cancelScheduledValues(0);
      voice.env.gain.setTargetAtTime(0.0, 0, 0.05 );
      voice.osc.frequency.cancelScheduledValues(0);
      voice.osc.frequency.setTargetAtTime( 440 * Math.pow(2,(this.notes[this.notes.length-1]-69)/12), 0, 0.05 );
    }
  };
  
  return PolySynth;
});
