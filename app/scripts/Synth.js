/*global define*/
'use strict';
define(['GMInstrument'],
function(GMInstrument){
  var Synth = function(context)
  {
    GMInstrument.call(this, context);
    this.out = context.createGain();
  };
  
  Synth.prototype = Object.create(GMInstrument.prototype);
  Synth.prototype.constructor = Synth;
  
  Synth.prototype.update = function(midi)
  {
    GMInstrument.prototype.update.call(this, midi);
    this.out.gain.value = this.volume;
  };
  Synth.prototype.connect = function(output)
  {
    this.out.connect(output);
  };
  
  return Synth;
});
