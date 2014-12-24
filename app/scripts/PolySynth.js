/*global define*/
'use strict';
define(['Synth', 'Voice', 'Note'],
function(Instrument ,  Voice, Note ){
  var PolySynth = function(context, props)
  {
    Instrument.call(this, context);
    this.voices = [];
    this.env = context.createGain();
    for(var i=0;i<props.voices; ++i)
    {
      this.voices[i] = new Voice(context);
      var voice = this.voices[i];
      voice.type = 'triangle';
      voice.start();
      voice.connect(this.out);
      voice.update();
    }
    this.env.gain.value = 1.0;
    this.env.connect(this.out);
  };
  
  PolySynth.prototype = Object.create(Instrument.prototype);
  
  PolySynth.prototype.constructor = PolySynth;
  
  PolySynth.prototype.noteOn = function(note)
  {
    Instrument.prototype.noteOn.call(this, note);
    var i = Note.find(this.notes, note.key);
    console.log(i)
    var voice = this.voices[i];
    note.voice = voice;
    if(voice)
    {
      voice.osc.frequency.cancelScheduledValues(0);
      voice.osc.frequency.value = ( note.getFreq());
      voice.env.gain.cancelScheduledValues(0);
      voice.env.gain.setTargetAtTime(note.mag/127, 0, 0.05)
    }
  };
  PolySynth.prototype.noteOff = function(key)
  {
    //var i = this.notes.indexOf(key);
    var i = Note.find(this.notes, key);
    var voice = this.voices[i];
    Instrument.prototype.noteOff.call(this, key);
    if(!this.sustain && voice)
    {
      voice.env.gain.cancelScheduledValues(0);
      voice.env.gain.setTargetAtTime(0.0, 0, 0.05 );
      voice.osc.frequency.cancelScheduledValues(0);
      voice.osc.frequency.value = (this.notes[this.notes.length-1].getFreq());
    }
  };
  
  return PolySynth;
});
