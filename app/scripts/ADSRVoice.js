/*global define*/
'use strict';
define(['Voice'],
function(Voice){
  var AdsrProp = function(time, mag)
  {
    this.time = 0.0;
    this.mag = 0.0;
  };
  var AdsrVoice = function(context)
  {
    this.a = new AdsrProp();
    this.d = new AdsrProp();
    this.s = new AdsrProp();
    this.r = new AdsrProp();
  };
  
  AdsrVoice.prototype = Object.create(Voice.prototype);
  AdsrVoice.prototype.constructor = AdsrVoice;
  
  AdsrVoice.prototype.sing = function(key, mag)
  {
    if(mag === 0)
    {
      this.key = undefined;
    }
    else
    {
      this.key = key;
    }
    this.osc.frequency.cancelScheduledValues(0);
    this.osc.frequency.setTargetAtTime( Voice.getFreq(key),0, this.glis);
    this.env.gain.cancelScheduledValues(0);
    this.env.gain.setTargetAtTime(mag/127, 0, 0.15);
  };
  Voice.clean = function(voices)
  {
    for(var key in voices)
     if(voices[key])
      if(voices[key].key === undefined)
       if(voices[key].env.gain.value <= voices[key].threshold)
        voices[key] = undefined;
    return voices;
  };
  Voice.getSilent = function(voices)
  {
    for(var i = 0; voices.length>i; ++i)
     if(voices[i].env.gain.value <= voices[i].threshold)
      return voices[i];
  };
  return AdsrVoice;
});
