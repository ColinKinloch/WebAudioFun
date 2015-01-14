/*global define*/
'use strict';
define([''],
function(){
  var Sequence = function()
  {
    this.notes = {};
  };
  
  Sequence.prototype.record = function(t, note)
  {
    if(this[t].push)
    {
      this[t].push(note);
    }
    else if(this[t]===undefined)
    {
      this[t] = [note];
    }
  };
  Sequence.prototype.play = function(start, end)
  {
    var notes = [];
    
    for(var n in this.notes)
    {
      if(parseFloat(n)<start)
      {
        continue;
      }
      else if(parseFloat(n)>end)
      {
        continue;
      }
      notes.concat(this.notes[n]);
    }
    
    return notes;
  };
  
  return Sequence;
});
