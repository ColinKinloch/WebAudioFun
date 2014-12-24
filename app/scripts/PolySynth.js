/*global define*/
'use strict';
define(['Synth', 'Voice', 'Note'],
function(Synth ,  Voice, Note ){
  var PolySynth = function(context, props)
  {
    Synth.call(this, context);
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
  
  PolySynth.prototype = Object.create(Synth.prototype);
  
  PolySynth.prototype.constructor = PolySynth;
  
  PolySynth.prototype.update = function(midi)
  {
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
  PolySynth.prototype.noteOn = function(note)
  {
    Synth.prototype.noteOn.call(this, note);
    var i = Note.find(this.notes, note.key);
    console.log(i, 'on');
    var voice = this.voices[i];
    note.voice = voice;
    
    if(voice)
    {
      voice.sing(note);
    }
  };
  PolySynth.prototype.noteOff = function(note)
  {
    //var i = this.notes.indexOf(key);
    var i = Voice.find(this.voices, note.key);
    console.log(i, 'off');
    var voice = this.voices[i];
    Synth.prototype.noteOff.call(this, note);
    //var note = voice.note;
    //note.mag = 0.0;
    if(!this.sustain && voice)
    {
      voice.sing(note);
    }
  };
  
  return PolySynth;
});
