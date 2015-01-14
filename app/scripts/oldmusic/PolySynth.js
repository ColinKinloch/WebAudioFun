/*global define*/
'use strict';
define(['./Synth', './Voice'],
function(Synth ,  Voice){
  var PolySynth = function(context)
  {
    Synth.call(this, context);
    this.voices = [];
    this.active = {};
    this.env = context.createGain();
    /*for(var i=0;i<props.voices; ++i)
    {
      this.voices[i] = new Voice(context);
      var voice = this.voices[i];
      voice.type = 'triangle';
      voice.start();
      voice.connect(this.out);
      voice.update();
    }*/
    this.env.gain.value = 1.0;
    this.env.connect(this.out);
  };
  
  PolySynth.prototype = Object.create(Synth.prototype);
  PolySynth.prototype.constructor = PolySynth;
  
  PolySynth.prototype.update = function(midi)
  {
    this.active = Voice.clean(this.active);
    Synth.prototype.update.call(this, midi);
    /*var i = Note.find(this.notes, key);
    var voice = this.voices[i];
    if(!this.sustain)
    {
      console.log("go");
    }
    if(voice)
    {
      voice.sing(note);
    }*/
  };
  /**/
  PolySynth.prototype.noteOn = function(key, mag)
  {
    if(mag===0)
    {
      this.noteOff(key, mag);
    }
    Synth.prototype.noteOn.call(this, key, mag);
    //var voice = this.active[key] || Voice.getSilent(this.voices);//this.voices[i];
    var voice;
    if(this.active[key])
    {
      voice = this.active[key];
    }
    else
    {
      voice = new Voice(this.out.context, key, mag);
      voice.start();
      voice.connect(this.out);
    }
    //note.voice = voice;
    if(voice)
    {
      voice.sing(key, mag);
      this.active[key] = voice;
    }
  };
  PolySynth.prototype.noteOff = function(key, mag)
  {
    //var i = this.notes.indexOf(key);
    //var note = this.notes[i];
    var voice = this.active[key];
    Synth.prototype.noteOff.call(this, key, mag);
    //var note = voice.note;
    //note.mag = 0.0;
    if(voice)
    {
      voice.sing(key, 0.0);
    }
  };
  
  return PolySynth;
});
