/*global define*/
'use strict';
define([],
function(){
  var Voice = function(context)
  {
    this.env = context.createGain();
    this.osc = context.createOscillator();
    this.osc.connect(this.env);
    this.osc.type = 'sine';
  };
  Voice.prototype.connect = function(output)
  {
    this.env.connect(output);
    return this;
  };
  Voice.prototype.start = function()
  {
    this.osc.start();
    return this;
  };
  Voice.prototype.stop = function()
  {
    this.osc.stop();
    return this;
  };
  Voice.prototype.updateFreq = function()
  {
    this.osc.frequency.cancelScheduledValues(0);
    this.osc.frequency.value = this.note.getFreq();
  };
  Voice.prototype.updateLength = function()
  {
    if(this.note.length===Infinity)
    {
      this.startTime = this.env.context.currentTime;
      this.env.gain.cancelScheduledValues(0);
      this.env.gain.value = this.note.mag;
    }
    else
    {
      let dt = this.env.context.currentTime-this.startTime;
      this.startTime = this.env.context.currentTime;
      if((this.note.length-dt)>0&&this.note.length!==Infinity)
      {
        console.log(this.note.length-dt)
        this.env.gain.cancelScheduledValues(0);
        /*this.env.gain.setValueAtTime(0, (this.env.context.currentTime+this.note.length)-dt);*/
      }
    }
  };
  Voice.prototype.updateMag = function()
  {
    this.env.gain.cancelScheduledValues(0);
    this.env.gain.value = this.note.mag;
  };
  Voice.prototype.sing = function(note, start)
  {
    
    start = start || 0;
    
    this.startTime = this.env.context.currentTime;
    
    this.note = note;
    this.osc.frequency.cancelScheduledValues(0);
    this.osc.frequency.setValueAtTime(this.note.getFreq(), start);
    this.env.gain.cancelScheduledValues(0);
    this.env.gain.setValueAtTime(this.note.mag, start);
    if(this.note.length!==Infinity)
    {
      this.env.gain.cancelScheduledValues(0);
      this.env.gain.setValueAtTime(0, this.env.context.currentTime+this.note.length);
    }
    
    let that = this;
    Object.observe(this.note, function(changes)
    {
      for(var c in changes)
      {
        let change = changes[c];
        console.log(change);
        if(change.type === 'update')
        {
          //that.sing(changes[c].object)
          if(change.name === 'freq')
          {
            that.updateFreq();
          }
          else if(change.name === 'length')
          {
            that.updateLength();
          }
          else if(change.name === 'mag')
          {
            that.updateMag();
          }
        }
      }
    })
  };
  
  return Voice;
});
