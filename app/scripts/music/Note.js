/*global define*/
'use strict';
//Note definition and conversion
define([],
function(){
  var Note = function(key, mag, length)
  {
    this.freq = Note.toFreq(key);
    this.mag = mag || 0.0;
    this.length = length || Infinity;
    console.log('there', this.length)
  };
  
  Note.noteExp = /^[a-gA-G](es|#|is)*\-?\d*$/;
  Note.keyExp = /^[a-gA-G]/;
  Note.octaveExp = /\-?\d+$/;
  Note.sharpExp = /is|#|♯|/g;
  Note.dSharpExp = /𝄪/g;
  Note.flatExp = /es|♭/g;
  Note.dFlatExp = /𝄫/g;
  
  Note.prototype.set = function(val)
  {
    this.freq = Note.toFreq(val);
    return this;
  };
  Note.prototype.copy = function(note)
  {
    console.log('here', note.length)
    this.freq = note.freq;
    this.mag = note.mag;
    this.length = note.length;
    return this;
  };
  Note.prototype.getFreq = function()
  {
    return this.freq;
  };
  Note.prototype.getNote = function()
  {
    return Note.freqToNote(this.freq);
  };
  Note.prototype.getMidi = function()
  {
    return Note.freqToMidi(this.freq);
  };
  Note.find = function(notes, key)
  {
    for(var i = 0; notes.length>i; ++i)
    {
      if(notes[i].key===key)
      {
        return i;
      }
    }
  };
  Note.midiToFreq = function(midi)
  {
    return 440 * Math.pow(2,(midi-69)/12);
  };
  Note.noteToMidi = function(note)
  {
    if(! Note.noteExp.test(note))
    {
      throw 'Malformed note';
    }
    var key = Note.keyExp.exec(note)[0].toLowerCase();
    var octave = Note.octaveExp.exec(note) || [3];
    octave = Number(octave[0]);
    octave += 2;
    var sharp = note.match(Note.sharpExp) || [];
    var dSharp = note.match(Note.dSharpExp) || [];
    var flat = note.match(Note.flatExp) || [];
    var dFlat = note.match(Note.dFlatExp) || [];
    var intonation = (sharp.length+dSharp.length*2)-(flat.length+dFlat.length*2);
    key = ('c d ef g a b'.search(key))+intonation;
    return 12*octave+key;
  };
  Note.freqToMidi = function(freq)
  {
    return 69+12*Math.log2(freq/440);
  };
  Note.midiToNote = function(midi)
  {
    var key = midi%12;
    var octave = ((midi-key)/12)-2;
    var keys = 'ccddeffggaab';
    var intonation = '';
    if(key!==keys.search(keys[key]))
    {
      intonation = '#';
    }
    return ''+keys[key]+intonation+octave;
  };
  Note.freqToNote = function(freq)
  {
    return Note.midiToNote(Math.round(Note.freqToMidi(freq)));
  };
  Note.noteToFreq = function(note)
  {
    return Note.midiToFreq(Note.noteToMidi(note));
  };
  Note.toFreq = function(val)
  {
    switch(typeof val)
    {
      case 'string'://Lilypond note cis4 C4#
        return Note.noteToFreq(val);
      case 'number'://Freq
        return val;
      case 'undefined'://A4, 440Hz
        return 440;
      case 'object'://MIDI
        return Note.midiToFreq(val.key);
    }
  };
  
  return Note;
});
