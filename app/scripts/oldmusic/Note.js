/*global define*/
'use strict';
//Note definition and conversion
define([],
function(){
  var Note = function(key, mag)
  {
    this.freq = Note.toFreq(key);
    this.mag = mag || key.mag/127 || 0.0;
    this.bend = 0.0;
    this.length = Note.Eternal;
  };
  
  Note.Eternal = Infinity;
  Note.Maxima = 8;
  Note.Longa = 4;
  Note.Breve = 2;
  Note.SemiBreve = 1;
  Note.Minim = 1/2;
  Note.Crotchet = 1/4;
  Note.Quaver = 1/8;
  Note.SemiQuaver = 1/16;
  
  Note.prototype.getFreq = function()
  {
    var freq = this.freq;
    if(this.bend>0)
    {
      freq += 0;
    }
    return freq;
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
    if(! /^[a-gA-G](es|#|is)*\-?\d*$/.test(note))
    {
      throw 'Malformed note';
    }
    var key = /^[a-gA-G]/.exec(note)[0].toLowerCase();
    var octave =/\-?\d+$/.exec(note) || [3];
    octave = Number(octave[0]);
    octave += 2;
    var sharp = note.match(/is|#/g) || [];
    var flat = note.match(/es/g) || [];
    var intonation = sharp.length-flat.length;
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
      case 'undefined':
        return 440;
      case 'object'://MIDI
        return Note.midiToFreq(val.key);
    }
  };
  
  return Note;
});
