/*global define*/
'use strict';
define([],
function(){
  var Note = function(key, mag, voice)
  {
    console.log(key);
    this.freq = Note.toFreq(key);
    this.mag = mag || key.mag/127 || 0.0;
    this.bend = 0.0;
  };
  
  Note.prototype.getFreq = function()
  {
    var freq = this.freq;
    if(this.bend>0)
     freq += 0;
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
     if(notes[i].key===key)
      return i;
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
    var note='';
    var key = midi%12;
    var octave = ((midi-key)/12)-2;
    var keys = 'ccddeffggaab';
    var intonation = '';
    if(key!=keys.search(keys[key]))
    {
      intonation = '#';
    }
    return ''+keys[key]+intonation+octave;
    return ;
  };
  Note.freqToNote = function(freq)
  {
    return Note.midiToNote(Math.round(Note.freqToMidi(freq)));
  }
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
        break;
      case 'number'://Freq
        return val;
        break;
      case 'undefined':
        return 440;
        break;
      case 'object'://MIDI
        return Note.midiToFreq(val.key)
        break;
    }
  };
  
  return Note;
});
