/*global define*/
'use strict';
define(['./Note'],
function(Note){
  var Voice = function(context, key, mag)
  {
    //this.note = new Note();
    this.key = key || 69;
    this.env = context.createGain();
    this.osc = context.createOscillator();
    this.osc.connect(this.env);
    this.mag = mag || 0.0 ;
    this.type = 'sine';
    this.sing(this.key, this.mag);
  };
  Voice.prototype.connect = function(output)
  {
    this.env.connect(output);
  };
  Voice.prototype.update = function()
  {
    this.env.gain.value = this.mag;
    this.osc.type = this.type;
  };
  Voice.prototype.start = function()
  {
    this.osc.start();
  };
  Voice.prototype.stop = function()
  {
    this.osc.stop();
  };
  Voice.prototype.sing = function(key, mag)
  {
    this.key = key;
    this.osc.frequency.cancelScheduledValues(0);
    this.osc.frequency.setTargetAtTime( Note.midiToFreq(key),0, 0);
    this.env.gain.cancelScheduledValues(0);
    this.env.gain.setTargetAtTime(mag/127, 0, 0);
  };
  Voice.find = function(voices, key)
  {
    for(var i = 0; voices.length>i; ++i)
    {
      if(voices[i].key===key)
      {
        return i;
      }
    }
  };
  Voice.clean = function(voices)
  {
    for(var key in voices)
    {
      if(voices[key])
      {
        if(voices[key].key === undefined)
        {
          if(voices[key].env.gain.value <= 0)
          {
            voices[key].stop();
            delete voices[key];
          }
        }
      }
    }
    return voices;
  };
  Voice.getSilent = function(voices)
  {
    for(var i = 0; voices.length>i; ++i)
    {
      if(voices[i].env.gain.value <= 0)
      {
        return voices[i];
      }
    }
  };
  Voice.getFreq = function(key)
  {
    return Node.midiToFreq(key);
  };
  return Voice;
});
