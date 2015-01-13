/*global define*/
'use strict';
define(['./Note'],
function(Note){
  var Sequencer = function(notes)
  {
    this.oldt = 0;
    this.t = 0;
    this.speed = 1;
    this.notes = notes || {};
  };
  
  Sequencer.prototype.update = function(dt)
  {
    var notes = [];
    dt /= 1000*this.speed;
    this.t += dt;
    for(var n in this.notes)
    {
      if(parseFloat(n)<this.oldt)
      {
        continue;
      }
      else if(parseFloat(n)>this.t)
      {
        continue;
      }
      for(var i in this.notes[n])
      {
        switch(typeof this.notes[n][i])
        {
          case 'object':
          {
            if(this.notes[n][i] instanceof Note)
            {
              notes.push(this.notes[n][i]);
            }
            break;
          }
          case 'string':
          {
            var comm = this.notes[n][i];
            if(comm === 'restart')
            {
              this.t = this.oldt = 0;
            }
            else if(/u/.test(comm))
            {
              
            }
          }
        }
      }
    }
    this.oldt = this.t;
    return notes;
  };
  Sequencer.prototype.record = function(t, notes)
  {
    this.notes[t] = notes;//notes is array of Notes
  };
  
  return Sequencer;
});
