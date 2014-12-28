/*global define*/
'use strict';
//TODO Self timing
define(['Sequencer', 'Note'],
function(Sequencer ,  Note){
  var SimpleSeq = function(notes)
  {
    this.notes = notes || [];
    this.i = 0;
    this.bpm = 120;
  };
  
  SimpleSeq.prototype = Object.create(Sequencer.prototype);
  SimpleSeq.prototype.constructor = SimpleSeq;
  
  SimpleSeq.prototype.record = function(note)
  {
    this.notes.push(note);
  };
  SimpleSeq.prototype.next = function()
  {
    if(this.i===this.notes.length)
    {
      this.i = 0;
    }
    return this.notes[this.i++];
  };
  SimpleSeq.prototype.current = function()
  {
    var i;
    if(this.i===this.notes.length)
    {
      this.i = 0;
    }
    if(this.i===0)
    {
      i = this.notes.length-1;
    }
    else
    {
      i = this.i-1;
    }
    return this.notes[i];
  };
  
  return SimpleSeq;
});
