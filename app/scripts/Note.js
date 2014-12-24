/*global define*/
'use strict';
define([],
function(){
  var Note = function(key, mag, voice)
  {
    this.key = key;
    this.mag = mag || 1.0;
    this.voice = voice || null;
  };
  
  Note.prototype.getFreq = function()
  {
    return 440 * Math.pow(2,(this.key-69)/12);
  };
  
  Note.find = function(notes, key)
  {
    for(var i = 0; notes.length>i; ++i)
     if(notes[i].key===key)
      return i;
  };
  
  return Note;
});
