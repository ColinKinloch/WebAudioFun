/*global define*/
'use strict';
define(['./GoodSeq', './Note'],
function(Sequencer, Note){
  var ShepardSeq = function(interval, voices)
  {
    this.seq = new Array(voices);
    
    var length = voices*interval;
    var notes = new Array(length);
    for(var i=0; length>i; ++i)
    {
      var prev = i?i-1:length;
      notes[i] = [new Note(i*interval, 1), new Note(prev)];
    }
    
    for(var v in voices)
    {
      this.seq[v] = new Sequencer();
      this.seq[v].t = v*7;
    }
    this.bpm = 120;
    Sequencer.call(this, notes);
  };
  
  
  ShepardSeq.prototype.update = function()
  {
    
  };
  
  ShepardSeq.prototype.next = function()
  {
    if(this.i===this.notes.length)
    {
      this.i = 0;
    }
    return this.notes[this.i++];
  };
  
  return ShepardSeq;
});
