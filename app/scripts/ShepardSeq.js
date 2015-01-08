/*global define*/
'use strict';
define(['Sequencer', 'Note'],
function(Sequencer ,  Note){
  var ShepardSeq = function()
  {
    Sequencer.call(this);
    this.notes = notes || [];
    this.i = 0;
    this.bpm = 120;
  };
  
  SimpleSeq.prototype = Object.create(Sequencer.prototype);
  SimpleSeq.prototype.constructor = SimpleSeq;
  
  SimpleSeq.prototype.next = function()
  {
    if(this.i===this.notes.length)
    {
      this.i = 0;
    }
    return this.notes[this.i++];
  };
  
  return ShepardSeq;
});
