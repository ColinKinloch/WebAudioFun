/*global define*/
'use strict';
define(['Sequencer'],
function(Sequencer){
  var oldt = 0;
  var ProgSeq = function(notes)
  {
    this.t = 0;
    this.speed = 1;
    this.notes = notes || {};
  };
  
  ProgSeq.prototype.update(dt)
  {
    dt /= 1000*this.speed;
    this.t += dt;
    for(var n in this.notes)
    {
      if(parseFloat(n)<oldt)
      {
        continue;
      }
      else if(parseFloat(n)>this.t)
      {
        continue;
      }
      this.notes[n]();
    }
  };
});
