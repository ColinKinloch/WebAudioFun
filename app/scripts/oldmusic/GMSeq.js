/*global define*/
'use strict';
//General Midi sequencer
define(['./Sequencer'],
function(Sequencer){
  var GMSeq = function()
  {
    this.commands = {};
  };
  
  GMSeq.prototype = Object.create(Sequencer);
  GMSeq.prototype.constructor = GMSeq;
  
  GMSeq.prototype.record = function(midi, t)
  {
    this.commands[t] = midi;
  };
  
  return GMSeq;
});
